const express = require("express");
const Leave = require("../models/Leave");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// GET LEAVE REQUESTS HISTORY
// =========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error("Fetch leaves error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load leave history.",
    });
  }
});

// =========================
// APPLY FOR LEAVE API
// =========================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all leave request fields.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: "Invalid start or end date.",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date.",
      });
    }

    const diffTime = Math.abs(end - start);
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatShortDate = (dateObj) =>
      `${monthNames[dateObj.getMonth()]} ${dateObj.getDate() < 10 ? "0" : ""}${dateObj.getDate()}`;

    const formattedDates = `${formatShortDate(start)} - ${formatShortDate(end)}`;
    const requestId = `#LR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLeave = await Leave.create({
      userId: req.user.id,
      requestId,
      leaveType,
      startDate,
      endDate,
      datesFormatted: formattedDates,
      daysCount,
      reason: reason.trim(),
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully.",
      data: {
        id: newLeave._id,
        requestId: newLeave.requestId,
        leaveType: newLeave.leaveType,
        dates: newLeave.datesFormatted,
        days: `${newLeave.daysCount} Day${newLeave.daysCount > 1 ? "s" : ""}`,
        appliedOn: `${monthNames[new Date().getMonth()]} ${new Date().getDate() < 10 ? "0" : ""}${new Date().getDate()}, ${new Date().getFullYear()}`,
        status: newLeave.status,
      },
    });
  } catch (error) {
    console.error("Apply leave error:", error);
    res.status(500).json({
      success: false,
      message: "Server error submitting leave request.",
    });
  }
});

module.exports = router;
