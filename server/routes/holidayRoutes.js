const express = require("express");
const Holiday = require("../models/Holiday");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

const holidayRules = [
  { month: 0, day: 26, name: "Republic Day" },
  { month: 4, day: 1, name: "Labour Day" },
  { month: 7, day: 15, name: "Independence Day" },
  { month: 9, day: 2, name: "Gandhi Jayanti" },
  { month: 10, day: 14, name: "Children's Day" },
  { month: 11, day: 25, name: "Christmas" },
];

async function ensureStandardHolidays() {
  const now = new Date();
  const years = [now.getFullYear(), now.getFullYear() + 1];

  for (const year of years) {
    for (const holiday of holidayRules) {
      const date = new Date(year, holiday.month, holiday.day);
      date.setHours(0, 0, 0, 0);
      await Holiday.updateOne(
        { name: holiday.name, date },
        {
          $setOnInsert: {
            name: holiday.name,
            date,
            description: "Company holiday",
            isActive: true,
          },
        },
        { upsert: true }
      );
    }
  }
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    await ensureStandardHolidays();

    const from = new Date();
    from.setHours(0, 0, 0, 0);

    const requestedYear = Number(req.query.year);
    const requestedMonth = Number(req.query.month);

    let start = from;
    if (Number.isInteger(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100) {
      if (Number.isInteger(requestedMonth) && requestedMonth >= 0 && requestedMonth <= 11) {
        start = new Date(requestedYear, requestedMonth, 1);
      } else {
        start = new Date(requestedYear, 0, 1);
      }
      // Never expose dates before today as "upcoming".
      if (start < from) start = from;
    }

    const holidays = await Holiday.find({
      isActive: true,
      date: { $gte: start },
    })
      .sort({ date: 1 })
      .limit(50)
      .lean();

    res.json({ success: true, data: holidays });
  } catch (error) {
    console.error("Holiday list error:", error);
    res.status(500).json({ success: false, message: "Failed to load holidays." });
  }
});

router.post("/", authMiddleware, roleMiddleware("HR", "Admin"), async (req, res) => {
  try {
    const { name, date, description = "" } = req.body;
    if (!name || !date) {
      return res.status(400).json({ success: false, message: "Holiday name and date are required." });
    }

    const holiday = await Holiday.create({
      name,
      date: new Date(date),
      description,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({ success: true, data: holiday });
  } catch (error) {
    console.error("Create holiday error:", error);
    res.status(500).json({ success: false, message: "Failed to create holiday." });
  }
});

router.delete("/:id", authMiddleware, roleMiddleware("HR", "Admin"), async (req, res) => {
  try {
    await Holiday.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Holiday removed." });
  } catch (error) {
    console.error("Delete holiday error:", error);
    res.status(500).json({ success: false, message: "Failed to remove holiday." });
  }
});

module.exports = router;
