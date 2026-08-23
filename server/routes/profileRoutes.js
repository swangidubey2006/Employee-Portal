const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// GET USER PROFILE
// =========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load user profile.",
    });
  }
});

// =========================
// UPDATE USER PROFILE
// =========================
router.put("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    const {
      fullName,
      phone,
      department,
      designation,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      bankName,
      accountNumber,
      ifscCode,
      panNumber,
      avatarData,
    } = req.body;

    if (fullName) user.fullName = fullName.trim();
    if (phone) user.phone = phone.trim();
    if (department) user.department = department.trim();
    if (designation) user.designation = designation.trim();
    if (emergencyContactName) user.emergencyContactName = emergencyContactName.trim();
    if (emergencyContactPhone) user.emergencyContactPhone = emergencyContactPhone.trim();
    if (emergencyContactRelation) user.emergencyContactRelation = emergencyContactRelation.trim();
    if (bankName) user.bankName = bankName.trim();
    if (accountNumber) user.accountNumber = accountNumber.trim();
    if (ifscCode) user.ifscCode = ifscCode.trim();
    if (panNumber) user.panNumber = panNumber.trim();

    if (typeof avatarData === "string") {
      if (avatarData.length > 4 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Profile photo is too large. Please choose an image under 3 MB.",
        });
      }

      if (avatarData && !/^data:image\/(jpeg|jpg|png|webp);base64,/.test(avatarData)) {
        return res.status(400).json({
          success: false,
          message: "Only JPG, PNG or WebP profile photos are supported.",
        });
      }

      user.avatarData = avatarData;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
});

module.exports = router;
