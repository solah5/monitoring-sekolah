const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { auth } = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username & password wajib" });

  try {
    // REVISI QUERY: Kita JOIN ke tabel guru untuk ambil info wali kelas
    const query = `
      SELECT users.id, users.name, users.username, users.password, users.role,
             guru.id AS guru_id,
             guru.wali_kelas_tingkat, 
             guru.wali_kelas_rombel
      FROM users
      LEFT JOIN guru ON users.id = guru.user_id
      WHERE users.username = ? 
      LIMIT 1
    `;

    const [rows] = await pool.query(query, [username]);
    const user = rows[0];

    if (!user) return res.status(401).json({ message: "User tidak ditemukan" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Password salah" });

    // Payload Token: Masukkan info wali kelas ke dalam token
    const tokenPayload = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      guru_id: user.guru_id, // Penting untuk input nilai
      wali_kelas_tingkat: user.wali_kelas_tingkat, // Penting untuk filter siswa
      wali_kelas_rombel: user.wali_kelas_rombel    // Penting untuk filter siswa
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      token,
      user: tokenPayload,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/** GET /api/auth/me */
router.get("/me", auth(), async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;