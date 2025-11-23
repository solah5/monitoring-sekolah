const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth(["guru", "admin", "bk"]));

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT prestasi.*, siswa.nama AS nama_siswa, siswa.kelas 
      FROM prestasi 
      JOIN siswa ON prestasi.siswa_id = siswa.id
      ORDER BY prestasi.created_at DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { siswa_id, judul_prestasi, tingkat, tahun } = req.body;
    if (!siswa_id || !judul_prestasi) return res.status(400).json({ message: "Data wajib diisi" });

    await db.query(
      "INSERT INTO prestasi (siswa_id, judul_prestasi, tingkat, tahun) VALUES (?, ?, ?, ?)",
      [siswa_id, judul_prestasi, tingkat, tahun]
    );

    logActivity(req.user.name, "Input Prestasi", `Prestasi: ${judul_prestasi}`);
    res.json({ message: "Prestasi berhasil ditambahkan" });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { siswa_id, judul_prestasi, tingkat, tahun } = req.body;
    await db.query(
      "UPDATE prestasi SET siswa_id=?, judul_prestasi=?, tingkat=?, tahun=? WHERE id=?",
      [siswa_id, judul_prestasi, tingkat, tahun, req.params.id]
    );
    logActivity(req.user.name, "Edit Prestasi", `ID: ${req.params.id}`);
    res.json({ message: "Prestasi berhasil diupdate" });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM prestasi WHERE id=?", [req.params.id]);
    logActivity(req.user.name, "Hapus Prestasi", `ID: ${req.params.id}`);
    res.json({ message: "Prestasi berhasil dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;