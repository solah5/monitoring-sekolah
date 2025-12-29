const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth("admin"));

// GET: Ambil Semua Data Guru
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM guru ORDER BY nama ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST: Tambah Guru Baru
router.post("/", async (req, res) => {
  try {
    const { nip, nama, jabatan, wali_kelas_tingkat, wali_kelas_rombel } = req.body;

    if (!nip || !nama || !jabatan) 
      return res.status(400).json({ message: "NIP, Nama, dan Jabatan wajib diisi" });

    // Cek Duplicate NIP
    const [existing] = await db.query("SELECT id FROM guru WHERE nip = ?", [nip]);
    if(existing.length > 0) return res.status(400).json({ message: "NIP sudah terdaftar" });

    const [result] = await db.query(
      "INSERT INTO guru (nip, nama, jabatan, wali_kelas_tingkat, wali_kelas_rombel) VALUES (?, ?, ?, ?, ?)",
      [nip, nama, jabatan, wali_kelas_tingkat || null, wali_kelas_rombel || null]
    );

    logActivity(req.user.name, "Menambah Guru", `Nama: ${nama}`);
    res.json({ message: "Guru berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menyimpan data", error: err });
  }
});

// PUT: Edit Guru
router.put("/:id", async (req, res) => {
  try {
    const { nip, nama, jabatan, wali_kelas_tingkat, wali_kelas_rombel } = req.body;

    await db.query(
      "UPDATE guru SET nip=?, nama=?, jabatan=?, wali_kelas_tingkat=?, wali_kelas_rombel=? WHERE id=?",
      [nip, nama, jabatan, wali_kelas_tingkat || null, wali_kelas_rombel || null, req.params.id]
    );

    logActivity(req.user.name, "Mengedit Guru", `ID: ${req.params.id}, Nama: ${nama}`);
    res.json({ message: "Data guru diperbarui" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// DELETE: Hapus Guru
router.delete("/:id", async (req, res) => {
  try {
    // Ambil nama dulu untuk log
    const [rows] = await db.query("SELECT nama FROM guru WHERE id=?", [req.params.id]);
    const namaGuru = rows[0] ? rows[0].nama : "Unknown";

    await db.query("DELETE FROM guru WHERE id=?", [req.params.id]);

    logActivity(req.user.name, "Menghapus Guru", `Nama: ${namaGuru}`);
    res.json({ message: "Guru dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;