const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

router.use(auth(["guru", "admin"]));

// GET NILAI (Filter by Wali Kelas logic)
router.get("/", async (req, res) => {
  try {
    const { role, guru_id, wali_kelas_tingkat, wali_kelas_rombel } = req.user;
    
    // Query dasar: Ambil data nilai, join ke siswa dan mapel
    // Kita LEFT JOIN nilai, supaya siswa yang BELUM punya nilai tetap muncul di list frontend (nilainya null)
    let query = `
      SELECT 
        siswa.id as siswa_id, 
        siswa.nama as nama_siswa, 
        siswa.nis, 
        siswa.kelas,
        mapel.nama_mapel,
        mapel.id as mapel_id,
        nilai.tugas,
        nilai.uts,
        nilai.uas,
        nilai.nilai_akhir
      FROM siswa
    `;
    
    // Jika user sudah memilih mapel (biasanya dikirim lewat query param ?mapel_id=1)
    // Tapi untuk simplifikasi bulk input, kita kirim data siswa dulu.
    // Nanti frontend yang mencocokkan.
    
    // FILTER WALI KELAS
    if (role === 'guru' && wali_kelas_tingkat) {
        query += ` LEFT JOIN nilai ON siswa.id = nilai.siswa_id 
                   LEFT JOIN mapel ON nilai.mapel_id = mapel.id
                   WHERE siswa.kelas = ? AND siswa.rombel = ?`;
    } else {
        // Fallback untuk admin (lihat semua)
        query += ` LEFT JOIN nilai ON siswa.id = nilai.siswa_id 
                   LEFT JOIN mapel ON nilai.mapel_id = mapel.id`;
    }
    
    query += ` ORDER BY siswa.nama ASC`;

    const params = (role === 'guru') ? [wali_kelas_tingkat, wali_kelas_rombel] : [];
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST INPUT NILAI (SIMPAN / UPDATE)
router.post("/", async (req, res) => {
  try {
    const { siswa_id, mapel_id, tugas, uts, uas, semester } = req.body;
    const guru_id = req.user.guru_id; 

    if (!siswa_id || !mapel_id) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    // Gunakan ON DUPLICATE KEY UPDATE
    // Artinya: Kalau nilai untuk siswa ini & mapel ini sudah ada -> UPDATE. Kalau belum -> INSERT.
    const query = `
      INSERT INTO nilai (siswa_id, guru_id, mapel_id, tugas, uts, uas, semester) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      tugas = VALUES(tugas),
      uts = VALUES(uts),
      uas = VALUES(uas),
      guru_id = VALUES(guru_id)
    `;

    await db.query(query, [
      siswa_id, 
      guru_id, 
      mapel_id, 
      tugas || 0, 
      uts || 0, 
      uas || 0, 
      semester || 'Ganjil'
    ]);

    res.json({ message: "Nilai berhasil disimpan" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;