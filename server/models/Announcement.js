const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    tag: { type: String, default: "GENERAL", trim: true },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    publishedByName: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
