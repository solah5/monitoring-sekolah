const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

// Hanya Guru BK yang boleh akses (Admin juga boleh untuk monitoring)
router.use(auth(["bk", "admin"]));

// GET /api/bk/dashboard (Statistik Sederhana)
router.get("/dashboard", async (req, res) => {
  try {
    const [siswaCount] = await db.query("SELECT COUNT(*) as total FROM siswa");
    const [eligibleCount] = await db.query("SELECT COUNT(*) as total FROM siswa WHERE status_eligible = 'Eligible'");
    const [prestasiCount] = await db.query("SELECT COUNT(*) as total FROM prestasi");

    res.json({
      total_siswa: siswaCount[0].total,
      siswa_eligible: eligibleCount[0].total,
      total_prestasi: prestasiCount[0].total
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /api/bk/rekap (Data Siswa + Rata-rata Nilai)
router.get("/rekap", async (req, res) => {
  try {
    // Query kompleks untuk menghitung rata-rata nilai per siswa
    const query = `
      SELECT 
        s.id, s.nama, s.nis, s.kelas, s.status_eligible,
        COALESCE(AVG(n.nilai), 0) as rata_rata,
        (SELECT COUNT(*) FROM prestasi p WHERE p.siswa_id = s.id) as jumlah_prestasi
      FROM siswa s
      LEFT JOIN nilai n ON s.id = n.siswa_id
      GROUP BY s.id
      ORDER BY rata_rata DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// GET /api/bk/detail/:siswa_id (Lihat Detail Nilai & Prestasi Siswa Tertentu)
router.get("/detail/:siswa_id", async (req, res) => {
  try {
    const { siswa_id } = req.params;
    
    // Ambil Nilai
    const [nilai] = await db.query(`
      SELECT n.*, m.nama_mapel 
      FROM nilai n 
      JOIN mapel m ON n.mapel_id = m.id 
      WHERE n.siswa_id = ?
      ORDER BY m.nama_mapel ASC, n.jenis_nilai ASC
    `, [siswa_id]);

    // Ambil Prestasi
    const [prestasi] = await db.query(`
      SELECT * FROM prestasi WHERE siswa_id = ?
    `, [siswa_id]);

    res.json({ nilai, prestasi });
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT /api/bk/eligibility/:siswa_id (Update Status Eligible)
router.put("/eligibility/:siswa_id", async (req, res) => {
  try {
    const { status } = req.body; // 'Eligible' atau 'Tidak Eligible'
    const { siswa_id } = req.params;

    await db.query("UPDATE siswa SET status_eligible = ? WHERE id = ?", [status, siswa_id]);
    
    // Log aktivitas
    const [s] = await db.query("SELECT nama FROM siswa WHERE id = ?", [siswa_id]);
    logActivity(req.user.name, "Update Eligibility", `Siswa: ${s[0]?.nama}, Status: ${status}`);

    res.json({ message: "Status berhasil diperbarui" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;