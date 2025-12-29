const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth(["bk", "admin"]));

// GET /api/bk/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const [siswa] = await db.query("SELECT COUNT(*) as total FROM siswa");
    const [eligible] = await db.query("SELECT COUNT(*) as total FROM siswa WHERE status_eligible = 'Eligible'");
    const [prestasi] = await db.query("SELECT COUNT(*) as total FROM prestasi");

    res.json({
      total_siswa: siswa[0].total,
      siswa_eligible: eligible[0].total,
      total_prestasi: prestasi[0].total
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /api/bk/rekap
router.get("/rekap", async (req, res) => {
  try {
    // PERBAIKAN: Menggunakan 'n.nilai_akhir' sesuai struktur tabel database Anda
    const query = `
      SELECT 
        s.id, s.nama, s.nis, s.kelas, s.rombel, s.status_eligible,
        COALESCE(AVG(n.nilai_akhir), 0) as rata_rata, 
        (SELECT COUNT(*) FROM prestasi p WHERE p.siswa_id = s.id) as jumlah_prestasi
      FROM siswa s
      LEFT JOIN nilai n ON s.id = n.siswa_id
      GROUP BY s.id
      ORDER BY rata_rata DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).send(err);
  }
});

// GET Detail
router.get("/detail/:siswa_id", async (req, res) => {
  try {
    const { siswa_id } = req.params;
    // Menggunakan nilai_akhir untuk detail juga
    const [nilai] = await db.query(`
      SELECT n.id, n.nilai_akhir as nilai, m.nama_mapel, n.semester
      FROM nilai n 
      JOIN mapel m ON n.mapel_id = m.id 
      WHERE n.siswa_id = ?
      ORDER BY m.nama_mapel ASC
    `, [siswa_id]);

    const [prestasi] = await db.query("SELECT * FROM prestasi WHERE siswa_id = ?", [siswa_id]);

    res.json({ nilai, prestasi });
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT Eligibility
router.put("/eligibility/:siswa_id", async (req, res) => {
  try {
    const { status } = req.body;
    await db.query("UPDATE siswa SET status_eligible = ? WHERE id = ?", [status, req.params.siswa_id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;