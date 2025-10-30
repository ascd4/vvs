// middleware/authJWT.js
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await connectDB();
    const [rows] = await db.query("SELECT id, name, email, google_id, role FROM users WHERE id=?", [decoded.id]);
    if (rows.length === 0) return res.status(401).json({ message: "User not found" });

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired" });
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticateJWT };
