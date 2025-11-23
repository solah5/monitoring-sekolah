require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../config/db");

(async () => {
  try {
    const username = "admin";
    const name = "Administrator";
    const passPlain = "admin123"; // ganti setelah login pertama!

    const [rows] = await pool.query("SELECT id FROM users WHERE username=?", [username]);
    if (rows.length) {
      console.log("Admin sudah ada.");
      process.exit(0);
    }

    const hash = await bcrypt.hash(passPlain, 10);
    await pool.query(
      "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, 'admin')",
      [name, username, hash]
    );
    console.log("Admin dibuat: username=admin, password=admin123");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
