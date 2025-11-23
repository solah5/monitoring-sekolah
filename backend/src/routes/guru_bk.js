const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

// Hanya admin yang boleh mengelola data Guru BK
router.use(auth("admin"));

// GET /api/guru_bk
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM guru_bk");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// GET /api/guru_bk/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM guru_bk WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST /api/guru_bk
router.post("/", async (req, res) => {
  try {
    const { nama, nip } = req.body;

    if (!nama || !nip)
      return res.status(400).json({ message: "Nama dan NIP wajib diisi" });

    const [result] = await db.query(
      "INSERT INTO guru_bk (nama, nip) VALUES (?, ?)",
      [nama, nip]
    );

    logActivity(req.user.name, "Menambah Guru BK", `Nama: ${nama}`);
    res.json({ message: "Guru BK created", id: result.insertId });
  } catch (err) {
    console.error("INSERT ERROR:", err);
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "NIP sudah terdaftar." });
    }
    res.status(500).json({ message: "Error", error: err });
  }
});

// PUT /api/guru_bk/:id
router.put("/:id", async (req, res) => {
  try {
    const { nama, nip } = req.body;

    await db.query(
      "UPDATE guru_bk SET nama=?, nip=? WHERE id=?",
      [nama, nip, req.params.id]
    );

    logActivity(req.user.name, "Mengedit Guru BK", `ID: ${req.params.id}, Nama: ${nama}`);
    res.json({ message: "Guru BK updated" });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "NIP sudah terdaftar." });
    }
    res.status(500).send(err);
  }
});

// DELETE /api/guru_bk/:id
router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT nama FROM guru_bk WHERE id = ?", [req.params.id]);
    const namaGuru = rows[0] ? rows[0].nama : `ID: ${req.params.id}`;

    await db.query("DELETE FROM guru_bk WHERE id=?", [req.params.id]);

    logActivity(req.user.name, "Menghapus Guru BK", `Nama: ${namaGuru}`);
    res.json({ message: "Guru BK deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;