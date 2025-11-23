const db = require("../config/db"); 

async function logActivity(username, action, details = "") {
  try {
    // 1. Masukkan log baru
    await db.query(
      "INSERT INTO aktivitas (username, action, details) VALUES (?, ?, ?)",
      [username, action, details]
    );

    // 2. Hapus log lama, simpan hanya 100 log terakhir agar database tidak penuh
    // (Anda bisa ubah LIMIT 100 ini)
    await db.query(
        "DELETE FROM aktivitas WHERE id NOT IN (SELECT id FROM (SELECT id FROM aktivitas ORDER BY timestamp DESC LIMIT 100) as temp)"
      );

  } catch (e) {
    console.error("Gagal mencatat aktivitas:", e);
  }
}

module.exports = { logActivity };