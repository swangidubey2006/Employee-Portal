const express = require("express");
const Attendance = require("../models/Attendance");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const getToday = () => {
  const now = new Date();
  const dateKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return { now, dateKey };
};

const formatDate = (date) =>
  date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date) =>
  date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const calculateWorkingHours = (start, end) => {
  if (!start || !end) return "00h 00m";

  const minutes = Math.max(
    0,
    Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000)
  );

  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}h ${String(
    minutes % 60
  ).padStart(2, "0")}m`;
};

// GET attendance for the logged-in employee only
router.get("/", authMiddleware, async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user.id }).sort({
      dateKey: -1,
    });

    const { dateKey } = getToday();
    const todayRecord = records.find((record) => record.dateKey === dateKey);

    const presentDays = records.filter((r) => r.status === "Present").length;
    const checkedInDays = records.filter(
      (r) => r.status === "Checked In"
    ).length;
    const absentDays = records.filter((r) => r.status === "Absent").length;

    const workingDays = presentDays + checkedInDays + absentDays;
    const attendancePercentage =
      workingDays > 0
        ? `${Math.round(((presentDays + checkedInDays) / workingDays) * 100)}%`
        : "0%";

    res.json({
      success: true,
      data: {
        todayRecord:
          todayRecord || {
            date: formatDate(new Date()),
            dateKey,
            checkInTime: "--:--",
            checkOutTime: "--:--",
            workingHours: "00h 00m",
            status: "Not Checked In",
            workMode: "Office",
          },
        records,
        stats: {
          presentDays: presentDays + checkedInDays,
          totalWorkingDays: workingDays,
          absentDays,
          availableLeave: 12,
          attendancePercentage,
        },
      },
    });
  } catch (error) {
    console.error("Fetch attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load attendance history.",
    });
  }
});

// CHECK-IN
router.post("/check-in", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { workMode = "Office", scanCode = "", reason = "" } = req.body || {};

    if (!["Office", "Home"].includes(workMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid work mode.",
      });
    }

    if (workMode === "Home" && !String(reason).trim()) {
      return res.status(400).json({ success: false, message: "Please provide a reason for Work From Home." });
    }

    // Both Office and WFH flows use the company QR as the final verification step.
    if (workMode === "Office" || workMode === "Home") {
      const expectedCode =
        process.env.OFFICE_ATTENDANCE_QR_CODE || "GYANYUG-OFFICE-ATTENDANCE";

      if (scanCode.trim() !== expectedCode) {
        return res.status(400).json({
          success: false,
          message:
            "Please scan the official GYANYUG office attendance QR code.",
        });
      }
    }

    const { now, dateKey } = getToday();

    const existing = await Attendance.findOne({
      userId,
      dateKey,
    });

    if (
      existing &&
      existing.checkInAt &&
      !existing.checkOutAt
    ) {
      return res.status(400).json({
        success: false,
        message: "You have already checked in for today.",
      });
    }

    if (existing && existing.checkOutAt) {
      return res.status(400).json({
        success: false,
        message: "Today's attendance is already completed.",
      });
    }

    const record = await Attendance.findOneAndUpdate(
      { userId, dateKey },
      {
        $set: {
          userId,
          date: formatDate(now),
          dateKey,
          checkInTime: formatTime(now),
          checkOutTime: "--:--",
          checkInAt: now,
          checkOutAt: null,
          workingHours: "00h 00m",
          status: "Checked In",
          workMode,
          workFromHomeReason: workMode === "Home" ? String(reason).trim() : "",
        },
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: `Checked in from ${workMode}.`,
      data: record,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during check-in.",
    });
  }
});

// CHECK-OUT
router.post("/check-out", authMiddleware, async (req, res) => {
  try {
    const { dateKey } = getToday();

    const record = await Attendance.findOne({
      userId: req.user.id,
      dateKey,
    });

    if (!record || !record.checkInAt) {
      return res.status(400).json({
        success: false,
        message: "You must check in before checking out.",
      });
    }

    if (record.checkOutAt) {
      return res.status(400).json({
        success: false,
        message: "You have already checked out for today.",
      });
    }

    const now = new Date();

    record.checkOutAt = now;
    record.checkOutTime = formatTime(now);
    record.workingHours = calculateWorkingHours(record.checkInAt, now);
    record.status = "Present";

    await record.save();

    res.json({
      success: true,
      message: "Checked out successfully.",
      data: record,
    });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during check-out.",
    });
  }
});

module.exports = router;
