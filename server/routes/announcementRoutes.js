const express = require("express");
const Announcement = require("../models/Announcement");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Everyone authenticated can read active announcements.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.json({ success: true, data: announcements });
  } catch (error) {
    console.error("Fetch announcements error:", error);
    res.status(500).json({ success: false, message: "Failed to load announcements." });
  }
});

// Only Admin/HR can publish.
router.post("/", authMiddleware, roleMiddleware("HR", "Admin"), async (req, res) => {
  try {
    const { title, message, tag = "GENERAL" } = req.body;
    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: "Title and message are required." });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      message: message.trim(),
      tag: String(tag || "GENERAL").trim().toUpperCase(),
      publishedBy: req.user.id,
      publishedByName: req.user.fullName || req.user.email || "Admin",
    });

    res.status(201).json({ success: true, message: "Announcement published.", data: announcement });
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({ success: false, message: "Failed to publish announcement." });
  }
});

// Admin/HR can deactivate an announcement.
router.patch("/:id", authMiddleware, roleMiddleware("HR", "Admin"), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: "Announcement not found." });
    if (typeof req.body.isActive === "boolean") announcement.isActive = req.body.isActive;
    await announcement.save();
    res.json({ success: true, data: announcement });
  } catch (error) {
    console.error("Update announcement error:", error);
    res.status(500).json({ success: false, message: "Failed to update announcement." });
  }
});

module.exports = router;
