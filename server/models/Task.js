const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      default: "Standard",
    },
    tag: {
      type: String,
      default: "STANDARD",
    },
    assignedTo: {
      type: String,
      default: "",
    },
    assignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    assignedRole: {
      type: String,
      default: "Team",
    },
    dueDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["TO DO", "IN PROGRESS", "REVIEW", "COMPLETED"],
      default: "TO DO",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
