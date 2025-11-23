const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { auth } = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/auth/login
 * body: { username, password }
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username & password wajib" });

  try {
    const [rows] = await pool.query(
      "SELECT id, name, username, password, role FROM users WHERE username=? LIMIT 1",
      [username]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "User tidak ditemukan" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, name: user.name, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, username: user.username, role: user.role },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/** GET /api/auth/me (cek token) */
router.get("/me", auth(), async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
