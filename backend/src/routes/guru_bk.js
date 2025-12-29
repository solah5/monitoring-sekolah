const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth("admin"));

// GET
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM guru_bk ORDER BY nama ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const { nama, nip } = req.body;
    if (!nama || !nip) return res.status(400).json({ message: "Nama & NIP wajib" });

    await db.query("INSERT INTO guru_bk (nama, nip) VALUES (?, ?)", [nama, nip]);
    
    logActivity(req.user.name, "Tambah Guru BK", `Nama: ${nama}`);
    res.json({ message: "Berhasil ditambahkan" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const { nama, nip } = req.body;
    await db.query("UPDATE guru_bk SET nama=?, nip=? WHERE id=?", [nama, nip, req.params.id]);
    
    logActivity(req.user.name, "Edit Guru BK", `ID: ${req.params.id}`);
    res.json({ message: "Berhasil diupdate" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM guru_bk WHERE id=?", [req.params.id]);
    logActivity(req.user.name, "Hapus Guru BK", `ID: ${req.params.id}`);
    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;