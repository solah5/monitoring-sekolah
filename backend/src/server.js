require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/auth.js"); 
const guruRoutes = require("./routes/guru.js"); 
const siswaRoutes = require("./routes/siswa.js"); 
const mapelRoutes = require("./routes/mapel.js");
const usersRoutes = require("./routes/users.js");
const guruBkRoutes = require("./routes/guru_bk.js"); // Pastikan nama file ini benar (pakai underscore)
const aktivitasRoutes = require("./routes/aktivitas.js");
const nilaiRoutes = require("./routes/nilai");
const prestasiRoutes = require("./routes/prestasi");
const bkRoutes = require("./routes/bk");
const siswaAreaRoutes = require("./routes/siswa_area");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API SMA Negeri 1 Gunung Sindur Running...");
});

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/guru", guruRoutes);
app.use("/api/siswa", siswaRoutes); 
app.use("/api/mapel", mapelRoutes);
app.use("/api/users", usersRoutes);

// PERBAIKAN DI SINI:
// Ubah menjadi "/api/guru-bk" (pakai strip) agar COCOK dengan Frontend
app.use("/api/guru-bk", guruBkRoutes); 

app.use("/api/aktivitas", aktivitasRoutes);
app.use("/api/nilai", nilaiRoutes);
app.use("/api/prestasi", prestasiRoutes);
app.use("/api/bk", bkRoutes);
app.use("/api/siswa-area", siswaAreaRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;

// Kode ini agar tetap bisa jalan saat ditest di laptop (node src/server.js)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}