const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware("HR", "Admin"), async (req, res) => {
  try {
    const users = await User.find({}, "_id fullName email department designation role avatarData")
      .sort({ fullName: 1 })
      .lean();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ success: false, message: "Failed to load users." });
  }
});

module.exports = router;
