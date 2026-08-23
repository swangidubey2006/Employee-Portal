const express = require("express");
const Document = require("../models/Document");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const initialDocumentsSeed = [
  {
    docId: "doc-1",
    title: "Offer Letter",
    category: "Letters",
    date: "Oct 12, 2024",
    status: "AVAILABLE",
    filePath: "/docs/Offer_Letter.pdf",
  },
  {
    docId: "doc-2",
    title: "Appointment Letter",
    category: "Letters",
    date: "Oct 15, 2024",
    status: "AVAILABLE",
    filePath: "/docs/Appointment_Letter.pdf",
  },
  {
    docId: "doc-3",
    title: "Salary Slip – January 2026",
    category: "Salary Slips",
    date: "Feb 01, 2026",
    status: "AVAILABLE",
    filePath: "/docs/Salary_Slip_Jan_2026.pdf",
  },
  {
    docId: "doc-4",
    title: "Company Policy Handbook",
    category: "Policies",
    date: "Jan 01, 2026",
    status: "AVAILABLE",
    filePath: "/docs/Company_Policy_Handbook.pdf",
  },
];

// =========================
// GET ALL DOCUMENTS
// =========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    let docs = await Document.find().sort({ createdAt: -1 });

    if (docs.length === 0) {
      docs = await Document.insertMany(initialDocumentsSeed);
    }

    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    console.error("Fetch documents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load document records.",
    });
  }
});

// =========================
// DOWNLOAD DOCUMENT API
// =========================
router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    // Set download headers for realistic file download
    res.setHeader("Content-Disposition", `attachment; filename=${doc.title.replace(/\s+/g, "_")}.txt`);
    res.setHeader("Content-Type", "text/plain");
    res.send(`Official GYANYUG Document\nTitle: ${doc.title}\nCategory: ${doc.category}\nDate: ${doc.date}\nStatus: ${doc.status}`);
  } catch (error) {
    console.error("Download document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download document.",
    });
  }
});

module.exports = router;
