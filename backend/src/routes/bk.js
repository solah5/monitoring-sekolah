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
    // PERBAIKAN: Ganti 'n.nilai' menjadi 'n.nilai_akhir'
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
    
    // 1. Ambil data nilai mentah (kolom tugas, uts, uas, nilai_akhir)
    const [rawNilai] = await db.query(`
      SELECT n.tugas, n.uts, n.uas, n.nilai_akhir, m.nama_mapel 
      FROM nilai n 
      JOIN mapel m ON n.mapel_id = m.id 
      WHERE n.siswa_id = ?
      ORDER BY m.nama_mapel ASC
    `, [siswa_id]);

    // 2. Transformasi data agar sesuai dengan tampilan Frontend (Unpivot)
    // Frontend mengharapkan array objek dengan key: { nama_mapel, jenis_nilai, nilai }
    let formattedNilai = [];
    
    rawNilai.forEach(item => {
        formattedNilai.push(
            { id: item.id + '_tugas', nama_mapel: item.nama_mapel, jenis_nilai: 'Tugas', nilai: item.tugas },
            { id: item.id + '_uts', nama_mapel: item.nama_mapel, jenis_nilai: 'UTS', nilai: item.uts },
            { id: item.id + '_uas', nama_mapel: item.nama_mapel, jenis_nilai: 'UAS', nilai: item.uas },
            { id: item.id + '_akhir', nama_mapel: item.nama_mapel, jenis_nilai: 'Nilai Akhir', nilai: item.nilai_akhir }
        );
    });

    // 3. Ambil Prestasi
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
    
    // Log Activity (Optional)
    // const [s] = await db.query("SELECT nama FROM siswa WHERE id=?", [req.params.siswa_id]);
    // logActivity(req.user.name, "Update Status Eligible", `Siswa: ${s[0]?.nama} -> ${status}`);

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;