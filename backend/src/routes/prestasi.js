const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");
const { logActivity } = require("../utils/logger");

// PERUBAHAN: Hapus 'bk' dari daftar role yang diizinkan
router.use(auth(["guru", "admin"]));

// --- HELPER FUNCTION: Cek Hak Akses Wali Kelas ---
async function checkAccess(user, siswaId) {
  // PERUBAHAN: Hanya Admin yang bebas akses (BK sudah diblokir di middleware atas)
  if (user.role === 'admin') return true;

  // Jika Guru, cek apakah siswa ada di kelas yang dia ampu
  if (user.role === 'guru') {
    const [siswa] = await db.query("SELECT kelas, rombel FROM siswa WHERE id = ?", [siswaId]);
    
    if (siswa.length === 0) return false;
    
    if (siswa[0].kelas === user.wali_kelas_tingkat && siswa[0].rombel === user.wali_kelas_rombel) {
      return true;
    }
    return false; 
  }

  return false; 
}

// GET: Ambil Data Prestasi
router.get("/", async (req, res) => {
  try {
    const { role, wali_kelas_tingkat, wali_kelas_rombel } = req.user;

    let query = `
      SELECT prestasi.*, siswa.nama AS nama_siswa, siswa.kelas, siswa.rombel, siswa.nis
      FROM prestasi 
      JOIN siswa ON prestasi.siswa_id = siswa.id
    `;
    
    let params = [];

    // Jika Guru, filter sesuai kelas
    if (role === 'guru' && wali_kelas_tingkat) {
       query += ` WHERE siswa.kelas = ? AND siswa.rombel = ?`;
       params.push(wali_kelas_tingkat, wali_kelas_rombel);
    }

    query += ` ORDER BY prestasi.tahun DESC, prestasi.id DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// POST: Tambah Prestasi
router.post("/", async (req, res) => {
  try {
    const { siswa_id, judul_prestasi, tingkat, tahun } = req.body;
    
    if (!siswa_id || !judul_prestasi) 
        return res.status(400).json({ message: "Data wajib diisi" });

    const isAllowed = await checkAccess(req.user, siswa_id);
    if (!isAllowed) {
        return res.status(403).json({ message: "Anda tidak memiliki akses untuk siswa ini." });
    }

    await db.query(
      "INSERT INTO prestasi (siswa_id, judul_prestasi, tingkat, tahun) VALUES (?, ?, ?, ?)",
      [siswa_id, judul_prestasi, tingkat, tahun]
    );

    logActivity(req.user.name, "Input Prestasi", `Prestasi: ${judul_prestasi}`);
    res.json({ message: "Prestasi berhasil ditambahkan" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// PUT: Edit Prestasi
router.put("/:id", async (req, res) => {
  try {
    const { siswa_id, judul_prestasi, tingkat, tahun } = req.body;

    const [existing] = await db.query("SELECT siswa_id FROM prestasi WHERE id = ?", [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

    const targetSiswaId = existing[0].siswa_id;
    const isAllowed = await checkAccess(req.user, targetSiswaId);
    
    if (!isAllowed) {
        return res.status(403).json({ message: "Anda tidak berhak mengedit data ini." });
    }

    if (siswa_id && siswa_id !== targetSiswaId) {
        const isNewAllowed = await checkAccess(req.user, siswa_id);
        if (!isNewAllowed) return res.status(403).json({ message: "Anda tidak berhak memindahkan ke siswa tersebut." });
    }

    const finalSiswaId = siswa_id || targetSiswaId;

    await db.query(
      "UPDATE prestasi SET siswa_id=?, judul_prestasi=?, tingkat=?, tahun=? WHERE id=?",
      [finalSiswaId, judul_prestasi, tingkat, tahun, req.params.id]
    );

    logActivity(req.user.name, "Edit Prestasi", `ID: ${req.params.id}`);
    res.json({ message: "Prestasi berhasil diupdate" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// DELETE: Hapus Prestasi
router.delete("/:id", async (req, res) => {
  try {
    const [existing] = await db.query("SELECT siswa_id FROM prestasi WHERE id = ?", [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

    const isAllowed = await checkAccess(req.user, existing[0].siswa_id);
    if (!isAllowed) {
        return res.status(403).json({ message: "Anda tidak berhak menghapus data ini." });
    }

    await db.query("DELETE FROM prestasi WHERE id=?", [req.params.id]);
    
    logActivity(req.user.name, "Hapus Prestasi", `ID: ${req.params.id}`);
    res.json({ message: "Prestasi berhasil dihapus" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;