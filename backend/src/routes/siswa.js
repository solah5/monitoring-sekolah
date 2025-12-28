const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger"); 

// GET ALL SISWA (DENGAN FILTER WALI KELAS)
router.get("/", auth(["admin", "guru", "bk"]), async (req, res) => {
  try {
    const { role, wali_kelas_tingkat, wali_kelas_rombel } = req.user;

    let query = "SELECT * FROM siswa";
    let params = [];

    // LOGIKA FILTER DOSEN PENGUJI:
    // Jika dia Guru, DAN dia punya data wali kelas (bukan null)
    if (role === 'guru' && wali_kelas_tingkat && wali_kelas_rombel) {
      query += " WHERE kelas = ? AND rombel = ? ORDER BY nama ASC";
      params = [wali_kelas_tingkat, wali_kelas_rombel];
    } else {
      // Jika Admin/BK, tampilkan semua urut nama
      query += " ORDER BY nama ASC";
    }

    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get("/:id", auth(["admin", "guru", "bk"]), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM siswa WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Create, Update, Delete (Biasanya Admin)
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const { nama, nis, nisn, kelas, rombel, tahun_masuk } = req.body; // Tambah rombel

    if (!nama || !nis || !kelas || !rombel)
      return res.status(400).json({ message: "Data tidak lengkap" });

    const [result] = await db.query(
      "INSERT INTO siswa (nama, nis, nisn, kelas, rombel, tahun_masuk) VALUES (?, ?, ?, ?, ?, ?)",
      [nama, nis, nisn, kelas, rombel, tahun_masuk]
    );

    logActivity(req.user.name, "Menambah Siswa", `Nama: ${nama}`);
    res.json({ message: "Siswa created", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update & Delete disederhanakan untuk Admin
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await db.query("DELETE FROM siswa WHERE id=?", [req.params.id]);
    res.json({ message: "Siswa deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;