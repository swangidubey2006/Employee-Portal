const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    dateKey: {
      type: String,
      required: true,
      index: true,
    },
    checkInTime: {
      type: String,
      default: "--:--",
    },
    checkOutTime: {
      type: String,
      default: "--:--",
    },
    checkInAt: {
      type: Date,
      default: null,
    },
    checkOutAt: {
      type: Date,
      default: null,
    },
    workingHours: {
      type: String,
      default: "00h 00m",
    },
    status: {
      type: String,
      enum: ["Checked In", "Present", "Absent"],
      default: "Checked In",
    },
    workMode: {
      type: String,
      enum: ["Office", "Home"],
      default: "Office",
    },
    workFromHomeReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
