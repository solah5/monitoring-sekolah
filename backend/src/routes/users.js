const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger"); // PERBAIKAN: Impor logger

// Hanya admin
router.use(auth("admin"));

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, username, role FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err); // Tambahkan log error
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    if (!name || !username || !password || !role)
      return res.status(400).json({ message: "Lengkapi semua data" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)",
      [name, username, hashedPassword, role]
    );

    // PERBAIKAN: Tambahkan Log Aktivitas
    logActivity(
      req.user.name,
      "Menambah Akun",
      `Username: ${username}, Role: ${role}`
    );

    res.json({ message: "User created", id: result.insertId });
  } catch (err) {
    console.error(err); // Tambahkan log error
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }
    res.status(500).json({ message: "Error", error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const { id } = req.params;

    if (!name || !username || !role)
      return res
        .status(400)
        .json({ message: "Nama, username, dan role wajib" });

    if (password) {
      // Jika password diisi, update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await db.query(
        "UPDATE users SET name=?, username=?, password=?, role=? WHERE id=?",
        [name, username, hashedPassword, role, id]
      );
    } else {
      // Jika password kosong, jangan update password
      await db.query("UPDATE users SET name=?, username=?, role=? WHERE id=?", [
        name,
        username,
        role,
        id,
      ]);
    }

    // PERBAIKAN: Tambahkan Log Aktivitas
    logActivity(
      req.user.name,
      "Mengedit Akun",
      `ID: ${id}, Username: ${username}`
    );

    res.json({ message: "User updated" });
  } catch (err) {
    console.error(err); // Tambahkan log error
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // PERBAIKAN: Cek agar admin tidak menghapus akunnya sendiri
    if (Number(req.params.id) === req.user.id) {
      return res
        .status(400)
        .json({ message: "Tidak dapat menghapus akun sendiri!" });
    }

    // PERBAIKAN: Ambil data nama sebelum dihapus untuk log
    const [rows] = await db.query("SELECT username FROM users WHERE id = ?", [
      req.params.id,
    ]);
    const username = rows[0] ? rows[0].username : `ID: ${req.params.id}`;

    await db.query("DELETE FROM users WHERE id=?", [req.params.id]);

    // PERBAIKAN: Tambahkan Log Aktivitas
    logActivity(req.user.name, "Menghapus Akun", `Username: ${username}`);

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err); // Tambahkan log error
    res.status(500).send(err);
  }
});

module.exports = router;
