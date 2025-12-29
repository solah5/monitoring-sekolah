const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

// Middleware: Pastikan yang akses hanya role 'siswa'
router.use(auth("siswa"));

// GET: Dashboard Data Siswa (Profil, Nilai, Prestasi)
router.get("/dashboard", async (req, res) => {
  try {
    const userId = req.user.id; // ID dari tabel users (dari token)

    // 1. Cari data siswa berdasarkan user_id
    const [siswa] = await db.query(
      "SELECT id, nama, nis, kelas, rombel, status_eligible FROM siswa WHERE user_id = ?", 
      [userId]
    );

    if (siswa.length === 0) {
      return res.status(404).json({ message: "Data siswa belum terhubung dengan akun ini." });
    }

    const siswaData = siswa[0];

    // 2. Ambil Nilai (Rata-rata / Nilai Akhir)
    // Kita ambil nilai_akhir dari tabel nilai
    const [nilai] = await db.query(`
      SELECT n.id, m.nama_mapel, n.nilai_akhir, n.mapel_id
      FROM nilai n
      JOIN mapel m ON n.mapel_id = m.id
      WHERE n.siswa_id = ?
      ORDER BY m.nama_mapel ASC
    `, [siswaData.id]);

    // 3. Ambil Prestasi
    const [prestasi] = await db.query(`
      SELECT judul_prestasi, tingkat, tahun 
      FROM prestasi 
      WHERE siswa_id = ? 
      ORDER BY tahun DESC
    `, [siswaData.id]);

    // Format response
    res.json({
      profil: {
        nama: siswaData.nama,
        kelas: `${siswaData.kelas} - ${siswaData.rombel}`, // Gabung Kelas & Rombel
        status_eligible: siswaData.status_eligible
      },
      nilai: nilai,
      prestasi: prestasi
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// GET: Detail Nilai (Untuk Modal)
router.get("/detail/:mapel_id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { mapel_id } = req.params;

    // Cari siswa_id dulu
    const [siswa] = await db.query("SELECT id FROM siswa WHERE user_id = ?", [userId]);
    if (siswa.length === 0) return res.status(404).json({ message: "Siswa tidak ditemukan" });
    
    const siswaId = siswa[0].id;

    // Ambil detail nilai (Tugas, UTS, UAS) - Sesuaikan dengan kolom di database Anda
    // Asumsi: tabel nilai punya kolom tugas, uts, uas, nilai_akhir
    const [rows] = await db.query(`
        SELECT n.tugas, n.uts, n.uas, n.nilai_akhir, m.nama_mapel
        FROM nilai n
        JOIN mapel m ON n.mapel_id = m.id
        WHERE n.siswa_id = ? AND n.mapel_id = ?
    `, [siswaId, mapel_id]);

    if (rows.length === 0) return res.json({ nama_mapel: "Mapel", detail: [] });

    const data = rows[0];
    
    // Format data agar mudah ditampilkan di frontend looping
    const detailFormatted = [
        { jenis_nilai: "Tugas Harian", nilai: data.tugas },
        { jenis_nilai: "UTS", nilai: data.uts },
        { jenis_nilai: "UAS", nilai: data.uas },
        { jenis_nilai: "Nilai Akhir", nilai: data.nilai_akhir }
    ];

    res.json({
        nama_mapel: data.nama_mapel,
        detail: detailFormatted
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;