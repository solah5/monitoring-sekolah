const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger"); 
// router.use(auth("admin"));

router.get("/", auth(["admin", "guru", "bk"]), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM siswa");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get("/:id", auth(["admin", "guru", "bk"]), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM siswa WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { nama, nis, nisn, kelas, tahun_masuk } = req.body;

    if (!nama || !nis || !nisn || !kelas || !tahun_masuk)
      return res
        .status(400)
        .json({
          message: "Lengkapi data (Nama, NIS, NISN, Kelas, Thn. Masuk)",
        });

    const [result] = await db.query(
      "INSERT INTO siswa (nama, nis, nisn, kelas, tahun_masuk) VALUES (?, ?, ?, ?, ?)",
      [nama, nis, nisn, kelas, tahun_masuk]
    );

    logActivity(req.user.name, "Menambah Siswa", `Nama: ${nama}, NIS: ${nis}`);

    res.json({ message: "Siswa created", id: result.insertId });
  } catch (err) {
    console.error("INSERT ERROR:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "NIS atau NISN sudah terdaftar." });
    }
    res.status(500).json({ message: "Error", error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { nama, nis, nisn, kelas, tahun_masuk, tahun_keluar } = req.body;

    await db.query(
      "UPDATE siswa SET nama=?, nis=?, nisn=?, kelas=?, tahun_masuk=?, tahun_keluar=? WHERE id=?",
      [nama, nis, nisn, kelas, tahun_masuk, tahun_keluar || null, req.params.id]
    );

    logActivity(
      req.user.name,
      "Mengedit Siswa",
      `ID: ${req.params.id}, Nama: ${nama}`
    );

    res.json({ message: "Siswa updated" });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "NIS atau NISN sudah terdaftar." });
    }
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT nama FROM siswa WHERE id = ?", [
      req.params.id,
    ]);
    const namaSiswa = rows[0] ? rows[0].nama : `ID: ${req.params.id}`;

    await db.query("DELETE FROM siswa WHERE id=?", [req.params.id]);

    logActivity(req.user.name, "Menghapus Siswa", `Nama: ${namaSiswa}`);

    res.json({ message: "Siswa deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
