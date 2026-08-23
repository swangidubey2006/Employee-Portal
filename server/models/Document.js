const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    docId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Letters", "Salary Slips", "Policies", "Other Documents"],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "AVAILABLE",
    },
    filePath: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);
