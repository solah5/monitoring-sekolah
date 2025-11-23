const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

// Guru & Admin boleh akses
router.use(auth(["guru", "admin"]));

// GET /api/nilai (Dengan JOIN ke siswa & mapel)
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT nilai.*, siswa.nama AS nama_siswa, siswa.nis, mapel.nama_mapel 
      FROM nilai 
      JOIN siswa ON nilai.siswa_id = siswa.id 
      JOIN mapel ON nilai.mapel_id = mapel.id
      ORDER BY nilai.created_at DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST /api/nilai
router.post("/", async (req, res) => {
  try {
    const { siswa_id, mapel_id, jenis_nilai, nilai } = req.body;
    if (!siswa_id || !mapel_id || !jenis_nilai || !nilai) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    await db.query(
      "INSERT INTO nilai (siswa_id, mapel_id, jenis_nilai, nilai) VALUES (?, ?, ?, ?)",
      [siswa_id, mapel_id, jenis_nilai, nilai]
    );

    logActivity(req.user.name, "Input Nilai", `Siswa ID: ${siswa_id}, Mapel ID: ${mapel_id}, Nilai: ${nilai}`);
    res.json({ message: "Nilai berhasil ditambahkan" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT /api/nilai/:id
router.put("/:id", async (req, res) => {
  try {
    const { siswa_id, mapel_id, jenis_nilai, nilai } = req.body;
    await db.query(
      "UPDATE nilai SET siswa_id=?, mapel_id=?, jenis_nilai=?, nilai=? WHERE id=?",
      [siswa_id, mapel_id, jenis_nilai, nilai, req.params.id]
    );
    
    logActivity(req.user.name, "Edit Nilai", `ID Nilai: ${req.params.id}`);
    res.json({ message: "Nilai berhasil diupdate" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE /api/nilai/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM nilai WHERE id=?", [req.params.id]);
    logActivity(req.user.name, "Hapus Nilai", `ID Nilai: ${req.params.id}`);
    res.json({ message: "Nilai berhasil dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;