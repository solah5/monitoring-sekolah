const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

router.use(auth(["admin", "guru"]));

router.get("/", auth(["admin", "guru", "bk"]), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM mapel");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { nama_mapel } = req.body;
    if (!nama_mapel)
      return res.status(400).json({ message: "Nama mapel wajib diisi" });

    const [result] = await db.query(
      "INSERT INTO mapel (nama_mapel) VALUES (?)",
      [nama_mapel]
    );

    logActivity(req.user.name, "Menambah Mapel", `Mapel: ${nama_mapel}`);

    res.json({ message: "Mapel created", id: result.insertId });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Error", error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { nama_mapel } = req.body;
    await db.query("UPDATE mapel SET nama_mapel=? WHERE id=?", [
      nama_mapel,
      req.params.id,
    ]);

    logActivity(
      req.user.name,
      "Mengedit Mapel",
      `ID: ${req.params.id}, Mapel: ${nama_mapel}`
    );

    res.json({ message: "Mapel updated" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT nama_mapel FROM mapel WHERE id = ?", [
      req.params.id,
    ]);
    const namaMapel = rows[0] ? rows[0].nama_mapel : `ID: ${req.params.id}`;

    await db.query("DELETE FROM mapel WHERE id=?", [req.params.id]);

    logActivity(req.user.name, "Menghapus Mapel", `Mapel: ${namaMapel}`);

    res.json({ message: "Mapel deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
