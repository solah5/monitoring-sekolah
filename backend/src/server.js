require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.js"); 
const guruRoutes = require("./routes/guru.js"); 
const siswaRoutes = require("./routes/siswa.js"); 
const mapelRoutes = require("./routes/mapel.js");
const usersRoutes = require("./routes/users.js");
const guruBkRoutes = require("./routes/guru_bk.js");
const aktivitasRoutes = require("./routes/aktivitas.js");
const nilaiRoutes = require("./routes/nilai");
const prestasiRoutes = require("./routes/prestasi");
const bkRoutes = require("./routes/bk");
const siswaAreaRoutes = require("./routes/siswa_area");
const dashboardRoutes = require("../routes/dashboard");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/guru", guruRoutes);
app.use("/api/siswa", siswaRoutes); 
app.use("/api/mapel", mapelRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/guru_bk", guruBkRoutes);
app.use("/api/aktivitas", aktivitasRoutes);
app.use("/api/nilai", nilaiRoutes);
app.use("/api/prestasi", prestasiRoutes);
app.use("/api/bk", bkRoutes);
app.use("/api/siswa-area", siswaAreaRoutes);
app.use("/api/dashboard", dashboardRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));

module.exports = app;

// Kode ini agar tetap bisa jalan saat ditest di laptop (node src/server.js)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}