const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");
const { authenticateJWT } = require("../middleware/authJWT");
const { requireRole } = require("../middleware/requireRole");

// --- GET pending events ---
router.get("/events/pending", authenticateJWT, requireRole("admin"), async (req, res) => {
  try {
    const db = await connectDB();
    const [pendingEvents] = await db.query("SELECT * FROM event WHERE Status = 'Pending'");
    res.json({ message: "Pending events fetched successfully", events: pendingEvents });
  } catch (err) {
    console.error("✗ Admin fetch pending events error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// --- PATCH update event status ---
router.patch("/events/:id/status", authenticateJWT, requireRole("admin"), async (req, res) => {
  try {
    const db = await connectDB();
    const eventId = req.params.id;
    const { status } = req.body; // "Approved" หรือ "Rejected"

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const [result] = await db.query("UPDATE event SET Status = ? WHERE id = ?", [status, eventId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: `Event status updated to ${status}`, eventId });
  } catch (err) {
    console.error("✗ Admin update event status error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
