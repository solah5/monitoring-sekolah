const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

// Guru & Admin boleh akses
router.use(auth(["guru", "admin"]));

// GET NILAI
router.get("/", async (req, res) => {
  try {
    const { role, guru_id } = req.user;
    
    // Base Query
    let query = `
      SELECT nilai.*, siswa.nama AS nama_siswa, siswa.nis, mapel.nama_mapel 
      FROM nilai 
      JOIN siswa ON nilai.siswa_id = siswa.id 
      JOIN mapel ON nilai.mapel_id = mapel.id
    `;
    
    let params = [];

    // Jika Guru login, hanya tampilkan nilai yang DIA input (Opsional, biar rapi)
    // atau tampilkan nilai siswa kelas binaannya. 
    // Untuk amannya, kita filter berdasarkan siswa di kelas binaan dia.
    if (role === 'guru' && req.user.wali_kelas_tingkat) {
        query += ` WHERE siswa.kelas = ? AND siswa.rombel = ?`;
        params = [req.user.wali_kelas_tingkat, req.user.wali_kelas_rombel];
    }

    query += ` ORDER BY nilai.id DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST INPUT NILAI
router.post("/", async (req, res) => {
  try {
    const { siswa_id, mapel_id, nilai_pengetahuan, semester } = req.body;
    
    // Ambil guru_id dari Token (Bukan dari input manual form)
    // Ini menjamin keamanan bahwa nilai ini diinput oleh guru yang sedang login
    const guru_id_login = req.user.guru_id; 

    if (!siswa_id || !mapel_id || !nilai_pengetahuan) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    // Insert ke database (Sesuai struktur tabel baru di Langkah 1)
    await db.query(
      `INSERT INTO nilai (siswa_id, guru_id, mapel_id, nilai_pengetahuan, semester) 
       VALUES (?, ?, ?, ?, ?)`,
      [siswa_id, guru_id_login, mapel_id, nilai_pengetahuan, semester || 'Ganjil']
    );

    logActivity(req.user.name, "Input Nilai", `Siswa ID: ${siswa_id}, Nilai: ${nilai_pengetahuan}`);
    res.json({ message: "Nilai berhasil ditambahkan" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Hapus Nilai
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM nilai WHERE id=?", [req.params.id]);
    res.json({ message: "Nilai berhasil dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;