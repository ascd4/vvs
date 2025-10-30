// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const passport = require("./middleware/googleAuth");
const { authenticateJWT } = require("./middleware/authJWT");
const { requireRole } = require("./middleware/requireRole");
const { errorHandler } = require("./utils/errorHandler");
const routes = require("./routes");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// --- Register main routes here ---
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Authentication API with JWT",
    endpoints: {
      login: "/auth/google",
      callback: "/auth/google/callback",
      profile: "/api/me",
      protected: "/api/protected",
      admin: "/api/admin/users",
    },
  });
});

// Google login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

// Google callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login?error=auth_failed",
    session: false,
  }),
  (req, res) => {
    try {
      const payload = { id: req.user.id, email: req.user.email, role: req.user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
      res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    } catch (err) {
      console.error("✗ Token generation error:", err);
      res.redirect("http://localhost:5173/login?error=token_failed");
    }
  }
);

// Get current user profile (Protected Route)
app.get("/api/me", authenticateJWT, (req, res) => {
  res.json({ message: "User authenticated", user: req.user });
});

// Example Protected Route
app.get("/protected", authenticateJWT, (req, res) => {
  res.status(200).json({
    message: "Protected content accessed successfully",
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

// Admin Only Route
app.get("/admin/users", authenticateJWT, requireRole("admin"), async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, role, created_at FROM users");
    res.json({ message: "Admin access granted", users });
  } catch (err) {
    console.error("✗ Database error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Logout
app.get("/logout", (req, res) => {
  res.json({
    message: "Logout successful. Please remove token from client.",
    instructions: "Delete token from localStorage on frontend",
  });
});

// Error handler
app.use(errorHandler);

// Database init
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Google OAuth callback: ${process.env.GOOGLE_CALLBACK_URL}`);
});
