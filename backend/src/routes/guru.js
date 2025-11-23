// guru.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger"); 

router.use(auth("admin"));

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT guru.*, mapel.nama_mapel FROM guru LEFT JOIN mapel ON guru.mapel_id = mapel.id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT guru.*, mapel.nama_mapel FROM guru LEFT JOIN mapel ON guru.mapel_id = mapel.id WHERE guru.id = ?",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { nama, nip, mapel_id } = req.body; 

    if (!nama || !nip) // Mapel boleh null
      return res.status(400).json({ message: "Nama dan NIP wajib diisi" });

    const [result] = await db.query(
      "INSERT INTO guru (nama, nip, mapel_id) VALUES (?, ?, ?)",
      [nama, nip, mapel_id] 
    );

    logActivity(req.user.name, "Menambah Guru", `Nama: ${nama}`);

    res.json({ message: "Guru created", id: result.insertId });
  } catch (err) {
    console.error("INSERT ERROR:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { nama, nip, mapel_id } = req.body; 

    await db.query("UPDATE guru SET nama=?, nip=?, mapel_id=? WHERE id=?", [
      nama,
      nip,
      mapel_id, 
      req.params.id,
    ]);

    logActivity(req.user.name, "Mengedit Guru", `ID: ${req.params.id}, Nama: ${nama}`);

    res.json({ message: "Guru updated" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM guru WHERE id=?", [req.params.id]);

    logActivity(req.user.name, "Menghapus Guru", `Nama: ${namaGuru}`);

    res.json({ message: "Guru deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;