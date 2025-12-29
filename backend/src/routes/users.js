const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth("admin"));

// GET: Data User + Dropdown (Guru, Siswa, Guru BK)
router.get("/", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, username, role FROM users ORDER BY id DESC");
    
    // Ambil data orang yang BELUM punya akun (user_id IS NULL)
    const [guruOptions] = await db.query("SELECT id, nama, nip FROM guru WHERE user_id IS NULL");
    const [siswaOptions] = await db.query("SELECT id, nama, nis FROM siswa WHERE user_id IS NULL");
    // Tambahan: Ambil Guru BK
    const [bkOptions] = await db.query("SELECT id, nama, nip FROM guru_bk WHERE user_id IS NULL");

    res.json({
      users,
      options: {
        guru: guruOptions,
        siswa: siswaOptions,
        bk: bkOptions // Kirim ke frontend
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST: Tambah Akun
router.post("/", async (req, res) => {
  try {
    const { name, username, password, role, link_id } = req.body;

    if (!username || !password || !role) return res.status(400).json({ message: "Data tidak lengkap" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Buat User
    const [result] = await db.query(
      "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)",
      [name, username, hashedPassword, role]
    );
    const newUserId = result.insertId;

    // 2. Hubungkan ke tabel fisik masing-masing
    if (link_id) {
        if (role === 'guru') {
            await db.query("UPDATE guru SET user_id = ? WHERE id = ?", [newUserId, link_id]);
        } else if (role === 'siswa') {
            await db.query("UPDATE siswa SET user_id = ? WHERE id = ?", [newUserId, link_id]);
        } else if (role === 'bk') {
            // Tambahan: Update tabel guru_bk
            await db.query("UPDATE guru_bk SET user_id = ? WHERE id = ?", [newUserId, link_id]);
        }
    }

    logActivity(req.user.name, "Tambah Akun", `User: ${username}, Role: ${role}`);
    res.json({ message: "Akun berhasil dibuat" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat akun" });
  }
});

// DELETE: Hapus Akun
router.delete("/:id", async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: "Tidak bisa hapus diri sendiri" });

    // Lepaskan relasi (Set user_id = NULL)
    await db.query("UPDATE guru SET user_id = NULL WHERE user_id = ?", [req.params.id]);
    await db.query("UPDATE siswa SET user_id = NULL WHERE user_id = ?", [req.params.id]);
    await db.query("UPDATE guru_bk SET user_id = NULL WHERE user_id = ?", [req.params.id]);

    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    
    logActivity(req.user.name, "Hapus Akun", `ID: ${req.params.id}`);
    res.json({ message: "Akun dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;