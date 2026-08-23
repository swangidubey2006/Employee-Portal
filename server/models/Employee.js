const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "+91 98765 43210",
    },
    department: {
      type: String,
      enum: ["HR", "IT", "Content", "Academic"],
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: String,
      default: "15 Jan, 2024",
    },
    reportingManager: {
      type: String,
      default: "Alex Rivera",
    },
    status: {
      type: String,
      enum: ["Active", "Away"],
      default: "Active",
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
