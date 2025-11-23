const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

router.use(auth("siswa"));

async function getSiswaId(nisn) {
  const [rows] = await db.query("SELECT id, nama, kelas, status_eligible FROM siswa WHERE nisn = ?", [nisn]);
  return rows[0];
}

// GET /api/siswa-area/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const siswa = await getSiswaId(req.user.username);
    if (!siswa) return res.status(404).json({ message: "Data siswa tidak ditemukan." });

    // Update Query: Tambahkan m.id as mapel_id
    const [nilai] = await db.query(`
      SELECT 
        m.id as mapel_id, 
        m.nama_mapel, 
        ROUND(AVG(n.nilai), 2) as nilai_akhir
      FROM nilai n
      JOIN mapel m ON n.mapel_id = m.id
      WHERE n.siswa_id = ?
      GROUP BY n.mapel_id
      ORDER BY m.nama_mapel ASC
    `, [siswa.id]);

    const [prestasi] = await db.query(`
      SELECT judul_prestasi, tingkat, tahun FROM prestasi WHERE siswa_id = ? ORDER BY tahun DESC
    `, [siswa.id]);

    res.json({ profil: siswa, nilai: nilai, prestasi: prestasi });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// RUTE BARU: GET /api/siswa-area/detail/:mapel_id
router.get("/detail/:mapel_id", async (req, res) => {
  try {
    const siswa = await getSiswaId(req.user.username);
    if (!siswa) return res.status(404).json({ message: "Siswa tidak ditemukan" });

    const { mapel_id } = req.params;

    // Ambil rincian nilai
    const [rows] = await db.query(`
        SELECT jenis_nilai, nilai
        FROM nilai
        WHERE siswa_id = ? AND mapel_id = ?
        ORDER BY FIELD(jenis_nilai, 'UH1', 'UH2', 'UH3', 'Tugas', 'PTS', 'PAS')
    `, [siswa.id, mapel_id]);

    // Ambil nama mapel
    const [mapel] = await db.query("SELECT nama_mapel FROM mapel WHERE id = ?", [mapel_id]);

    res.json({
        nama_mapel: mapel[0]?.nama_mapel,
        detail: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;