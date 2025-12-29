const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth("admin"));

// GET: Ambil user + Opsi Guru/Siswa yang belum punya akun
router.get("/", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, username, role FROM users ORDER BY id DESC");
    const [guruOptions] = await db.query("SELECT id, nama, nip FROM guru WHERE user_id IS NULL");
    const [siswaOptions] = await db.query("SELECT id, nama, nis FROM siswa WHERE user_id IS NULL");

    res.json({
      users,
      options: {
        guru: guruOptions,
        siswa: siswaOptions
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST: Tambah Akun
router.post("/", async (req, res) => {
  try {
    // link_id adalah ID dari tabel guru/siswa yang dipilih di dropdown
    const { name, username, password, role, link_id } = req.body;

    if (!username || !password || !role) return res.status(400).json({ message: "Data tidak lengkap" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Buat User Baru
    const [result] = await db.query(
      "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)",
      [name, username, hashedPassword, role]
    );
    const newUserId = result.insertId;

    // 2. Sambungkan ke Tabel Guru/Siswa (Jika dipilih dari dropdown)
    if (role === 'guru' && link_id) {
        await db.query("UPDATE guru SET user_id = ? WHERE id = ?", [newUserId, link_id]);
    } else if (role === 'siswa' && link_id) {
        await db.query("UPDATE siswa SET user_id = ? WHERE id = ?", [newUserId, link_id]);
    }

    logActivity(req.user.name, "Tambah Akun", `User: ${username}, Role: ${role}`);
    res.json({ message: "Akun berhasil dibuat" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Username mungkin sudah dipakai" });
  }
});

// PUT: Edit Akun
router.put("/:id", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    let query = "UPDATE users SET name=?, username=?, role=? WHERE id=?";
    let params = [name, username, role, req.params.id];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query = "UPDATE users SET name=?, username=?, password=?, role=? WHERE id=?";
        params = [name, username, hashedPassword, role, req.params.id];
    }

    await db.query(query, params);
    res.json({ message: "Akun diupdate" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE: Hapus Akun
router.delete("/:id", async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: "Tidak bisa hapus diri sendiri" });

    // Lepaskan relasi di tabel guru/siswa dulu (set user_id = NULL)
    await db.query("UPDATE guru SET user_id = NULL WHERE user_id = ?", [req.params.id]);
    await db.query("UPDATE siswa SET user_id = NULL WHERE user_id = ?", [req.params.id]);

    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    
    logActivity(req.user.name, "Hapus Akun", `ID: ${req.params.id}`);
    res.json({ message: "Akun dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;