const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth("admin"));

// GET: Ambil Semua Siswa
router.get("/", async (req, res) => {
  try {
    // Urutkan berdasarkan Kelas -> Rombel -> Nama
    const [rows] = await db.query("SELECT * FROM siswa ORDER BY kelas ASC, rombel ASC, nama ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST: Tambah Siswa
router.post("/", async (req, res) => {
  try {
    const { nis, nama, kelas, rombel } = req.body;

    if (!nis || !nama || !kelas || !rombel) 
      return res.status(400).json({ message: "Semua data (NIS, Nama, Kelas, Rombel) wajib diisi" });

    // Cek Duplicate NIS
    const [existing] = await db.query("SELECT id FROM siswa WHERE nis = ?", [nis]);
    if(existing.length > 0) return res.status(400).json({ message: "NIS sudah terdaftar" });

    const [result] = await db.query(
      "INSERT INTO siswa (nis, nama, kelas, rombel) VALUES (?, ?, ?, ?)",
      [nis, nama, kelas, rombel]
    );

    logActivity(req.user.name, "Menambah Siswa", `Nama: ${nama}, Kelas: ${kelas}-${rombel}`);
    res.json({ message: "Siswa berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menyimpan data", error: err });
  }
});

// PUT: Edit Siswa
router.put("/:id", async (req, res) => {
  try {
    const { nis, nama, kelas, rombel } = req.body;

    await db.query(
      "UPDATE siswa SET nis=?, nama=?, kelas=?, rombel=? WHERE id=?",
      [nis, nama, kelas, rombel, req.params.id]
    );

    logActivity(req.user.name, "Mengedit Siswa", `ID: ${req.params.id}, Nama: ${nama}`);
    res.json({ message: "Data siswa diperbarui" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// DELETE: Hapus Siswa
router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT nama FROM siswa WHERE id=?", [req.params.id]);
    const namaSiswa = rows[0] ? rows[0].nama : "Unknown";

    await db.query("DELETE FROM siswa WHERE id=?", [req.params.id]);

    logActivity(req.user.name, "Menghapus Siswa", `Nama: ${namaSiswa}`);
    res.json({ message: "Siswa dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;