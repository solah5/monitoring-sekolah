const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

// Rute ini mengambil 5 aktivitas terakhir untuk dashboard admin
router.get("/", auth("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM aktivitas ORDER BY timestamp DESC LIMIT 5"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;