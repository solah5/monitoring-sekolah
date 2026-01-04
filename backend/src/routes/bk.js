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
    // PERBAIKAN: Menggunakan n.nilai_akhir (bukan n.nilai)
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
    console.error("SQL Error Rekap:", err);
    res.status(500).send(err);
  }
});

// GET /api/bk/detail/:siswa_id
router.get("/detail/:siswa_id", async (req, res) => {
  try {
    const { siswa_id } = req.params;
    
    // Ambil data nilai dan transformasikan agar sesuai format tabel frontend
    const [rawNilai] = await db.query(`
      SELECT n.id, n.tugas, n.uts, n.uas, n.nilai_akhir, m.nama_mapel 
      FROM nilai n 
      JOIN mapel m ON n.mapel_id = m.id 
      WHERE n.siswa_id = ?
      ORDER BY m.nama_mapel ASC
    `, [siswa_id]);

    let formattedNilai = [];
    rawNilai.forEach(item => {
        // Pecah satu baris DB menjadi beberapa baris untuk tampilan detail
        if(item.tugas) formattedNilai.push({ id: item.id+'t', nama_mapel: item.nama_mapel, jenis_nilai: 'Tugas', nilai: item.tugas });
        if(item.uts) formattedNilai.push({ id: item.id+'ut', nama_mapel: item.nama_mapel, jenis_nilai: 'UTS', nilai: item.uts });
        if(item.uas) formattedNilai.push({ id: item.id+'ua', nama_mapel: item.nama_mapel, jenis_nilai: 'UAS', nilai: item.uas });
        formattedNilai.push({ id: item.id+'na', nama_mapel: item.nama_mapel, jenis_nilai: 'Nilai Akhir', nilai: item.nilai_akhir });
    });

    const [prestasi] = await db.query(`
      SELECT * FROM prestasi WHERE siswa_id = ? ORDER BY tahun DESC
    `, [siswa_id]);

    res.json({ nilai: formattedNilai, prestasi });
  } catch (err) {
    console.error("SQL Error Detail:", err);
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