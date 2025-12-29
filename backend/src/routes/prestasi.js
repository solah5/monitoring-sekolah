const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth(["guru", "admin", "bk"]));

// GET: Ambil Prestasi (Filter Wali Kelas)
router.get("/", async (req, res) => {
  try {
    const { role, wali_kelas_tingkat, wali_kelas_rombel } = req.user;

    let query = `
      SELECT prestasi.*, siswa.nama AS nama_siswa, siswa.kelas, siswa.nis
      FROM prestasi 
      JOIN siswa ON prestasi.siswa_id = siswa.id
    `;
    
    let params = [];

    // LOGIKA FILTER WALI KELAS
    if (role === 'guru' && wali_kelas_tingkat) {
       query += ` WHERE siswa.kelas = ? AND siswa.rombel = ?`;
       params.push(wali_kelas_tingkat, wali_kelas_rombel);
    }

    query += ` ORDER BY prestasi.created_at DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST: Tambah Prestasi
router.post("/", async (req, res) => {
  try {
    const { siswa_id, judul_prestasi, tingkat, tahun } = req.body;
    if (!siswa_id || !judul_prestasi) return res.status(400).json({ message: "Data wajib diisi" });

    await db.query(
      "INSERT INTO prestasi (siswa_id, judul_prestasi, tingkat, tahun) VALUES (?, ?, ?, ?)",
      [siswa_id, judul_prestasi, tingkat, tahun]
    );

    logActivity(req.user.name, "Input Prestasi", `Prestasi: ${judul_prestasi}`);
    res.json({ message: "Prestasi berhasil ditambahkan" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT: Edit Prestasi
router.put("/:id", async (req, res) => {
  try {
    const { judul_prestasi, tingkat, tahun } = req.body;
    await db.query(
      "UPDATE prestasi SET judul_prestasi=?, tingkat=?, tahun=? WHERE id=?",
      [judul_prestasi, tingkat, tahun, req.params.id]
    );
    logActivity(req.user.name, "Edit Prestasi", `ID: ${req.params.id}`);
    res.json({ message: "Prestasi berhasil diupdate" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE: Hapus
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM prestasi WHERE id=?", [req.params.id]);
    logActivity(req.user.name, "Hapus Prestasi", `ID: ${req.params.id}`);
    res.json({ message: "Prestasi berhasil dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;