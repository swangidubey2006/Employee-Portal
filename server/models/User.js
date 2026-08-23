const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
      default: "",
    },

    authProvider: {
      type: String,
      enum: ["google", "microsoft", "local"],
      default: "local",
    },

    providerId: {
      type: String,
      default: "",
      index: true,
    },

    role: {
      type: String,
      default: "Employee",
    },

    department: {
      type: String,
      default: "Web Development",
    },

    designation: {
      type: String,
      default: "Frontend Developer Intern",
    },

    phone: {
      type: String,
      default: "+91 98765 43210",
    },

    joiningDate: {
      type: String,
      default: "15 Jan, 2024",
    },

    reportingManager: {
      type: String,
      default: "Alex Rivera",
    },

    emergencyContactName: {
      type: String,
      default: "Rajesh Kumari",
    },

    emergencyContactPhone: {
      type: String,
      default: "+91 98123 45678",
    },

    emergencyContactRelation: {
      type: String,
      default: "Father",
    },

    bankName: {
      type: String,
      default: "HDFC Bank Ltd.",
    },

    accountNumber: {
      type: String,
      default: "50100234567891",
    },

    ifscCode: {
      type: String,
      default: "HDFC0001234",
    },

    panNumber: {
      type: String,
      default: "ABCDE1234F",
    },

    avatarData: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);