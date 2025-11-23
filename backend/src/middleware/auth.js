// middleware/auth.js
const jwt = require("jsonwebtoken");

// Middleware ini akan kita gunakan di guru.js
function auth(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Akses ditolak. Tidak ada token." });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Format token salah." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Cek role jika diperlukan
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Akses ditolak. Role tidak sesuai." });
      }

      next();
    } catch (e) {
      res.status(400).json({ message: "Token tidak valid." });
    }
  };
}

module.exports = { auth };