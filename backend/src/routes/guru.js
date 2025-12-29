const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth("admin"));

// GET: Ambil Semua Data Guru
router.get("/", async (req, res) => {
  try {
    // Tidak perlu JOIN mapel lagi
    const [rows] = await db.query("SELECT * FROM guru ORDER BY nama ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// GET: Ambil Satu Guru
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM guru WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST: Tambah Guru Baru
router.post("/", async (req, res) => {
  try {
    // Sesuaikan dengan kolom baru
    const { nip, nama, jabatan, wali_kelas } = req.body;

    if (!nip || !nama || !jabatan) 
      return res.status(400).json({ message: "NIP, Nama, dan Jabatan wajib diisi" });

    const [result] = await db.query(
      "INSERT INTO guru (nip, nama, jabatan, wali_kelas) VALUES (?, ?, ?, ?)",
      [nip, nama, jabatan, wali_kelas || null] // wali_kelas boleh kosong/null
    );

    logActivity(req.user.name, "Menambah Guru", `Nama: ${nama}`);
    res.json({ message: "Guru berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("INSERT ERROR:", err);
    res.status(500).json({ message: "Gagal menyimpan data", error: err });
  }
});

// PUT: Edit Guru
router.put("/:id", async (req, res) => {
  try {
    const { nip, nama, jabatan, wali_kelas } = req.body;

    await db.query(
      "UPDATE guru SET nip=?, nama=?, jabatan=?, wali_kelas=? WHERE id=?",
      [nip, nama, jabatan, wali_kelas || null, req.params.id]
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