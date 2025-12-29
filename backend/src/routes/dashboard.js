const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

router.use(auth("admin"));

// GET: Statistik Dashboard
router.get("/stats", async (req, res) => {
  try {
    // Hitung total data langsung dari database
    const [guru] = await db.query("SELECT COUNT(*) as total FROM guru");
    const [siswa] = await db.query("SELECT COUNT(*) as total FROM siswa");
    const [mapel] = await db.query("SELECT COUNT(*) as total FROM mapel");
    
    // Asumsi ada tabel guru_bk, jika tidak ada, hapus baris ini
    // Jika tabelnya 'guru' dengan jabatan 'bk', sesuaikan querynya
    // Disini saya asumsi tabel terpisah atau jabatan tertentu. 
    // Jika tabel guru_bk belum ada, kita set 0 dulu agar tidak error.
    let totalBK = 0;
    try {
        const [bk] = await db.query("SELECT COUNT(*) as total FROM users WHERE role='bk'"); 
        totalBK = bk[0].total;
    } catch (e) { totalBK = 0; }

    res.json({
      guru: guru[0].total,
      siswa: siswa[0].total,
      mapel: mapel[0].total,
      guruBk: totalBK
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;