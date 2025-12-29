const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

router.use(auth("admin"));

// GET: Statistik Dashboard
router.get("/stats", async (req, res) => {
  try {
    const [guru] = await db.query("SELECT COUNT(*) as total FROM guru");
    const [siswa] = await db.query("SELECT COUNT(*) as total FROM siswa");
    const [mapel] = await db.query("SELECT COUNT(*) as total FROM mapel");
    
    // Hitung akun Guru BK dari tabel users
    const [bk] = await db.query("SELECT COUNT(*) as total FROM users WHERE role='bk'");

    res.json({
      guru: guru[0].total,
      siswa: siswa[0].total,
      mapel: mapel[0].total,
      guruBk: bk[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;