const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

// 1. Izinkan Admin, BK, dan Guru
router.use(auth(["admin", "bk", "guru"]));

// 2. Middleware khusus Admin untuk Edit/Hapus
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Akses ditolak. Hanya Admin yang boleh mengubah data siswa." });
  }
  next();
};

// GET: Ambil Semua Siswa (FILTER WALI KELAS DITERAPKAN DI SINI)
router.get("/", async (req, res) => {
  try {
    let query = "SELECT * FROM siswa";
    let params = [];

    // JIKA YANG AKSES ADALAH GURU (WALI KELAS), FILTER DATANYA
    if (req.user.role === 'guru') {
       query += " WHERE kelas = ? AND rombel = ?";
       params.push(req.user.wali_kelas_tingkat, req.user.wali_kelas_rombel);
    }

    query += " ORDER BY kelas ASC, rombel ASC, nama ASC";

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST, PUT, DELETE (Hanya Admin) - Tetap sama seperti sebelumnya
router.post("/", adminOnly, async (req, res) => {
  try {
    const { nis, nama, kelas, rombel } = req.body;
    if (!nis || !nama || !kelas || !rombel) return res.status(400).json({ message: "Semua data wajib diisi" });

    const [existing] = await db.query("SELECT id FROM siswa WHERE nis = ?", [nis]);
    if(existing.length > 0) return res.status(400).json({ message: "NIS sudah terdaftar" });

    const [result] = await db.query(
      "INSERT INTO siswa (nis, nama, kelas, rombel) VALUES (?, ?, ?, ?)",
      [nis, nama, kelas, rombel]
    );
    logActivity(req.user.name, "Menambah Siswa", `Nama: ${nama}`);
    res.json({ message: "Siswa berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

router.put("/:id", adminOnly, async (req, res) => {
  try {
    const { nis, nama, kelas, rombel } = req.body;
    await db.query("UPDATE siswa SET nis=?, nama=?, kelas=?, rombel=? WHERE id=?", [nis, nama, kelas, rombel, req.params.id]);
    logActivity(req.user.name, "Mengedit Siswa", `ID: ${req.params.id}`);
    res.json({ message: "Data siswa diperbarui" });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", adminOnly, async (req, res) => {
  try {
    await db.query("DELETE FROM siswa WHERE id=?", [req.params.id]);
    logActivity(req.user.name, "Menghapus Siswa", `ID: ${req.params.id}`);
    res.json({ message: "Siswa dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;