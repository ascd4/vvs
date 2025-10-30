// routes/index.js
const express = require("express");
const router = express.Router();

router.use("/events", require("./events"));
router.use("/admin", require("./admin")); // เพิ่ม admin route
// router.use("/auth", require("./auth"));   // ตัวอย่างถ้ามี route auth เพิ่ม

module.exports = router;