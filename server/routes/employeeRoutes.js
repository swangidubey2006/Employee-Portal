const express = require("express");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

const initialEmployeesSeed = [
  {
    name: "Shristi Kumari",
    email: "shristi.k@gyanyug.com",
    phone: "+91 98765 11223",
    department: "HR",
    designation: "HR Executive",
    joiningDate: "10 Jan, 2024",
    reportingManager: "Alex Rivera (HR Admin)",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Rohit Sharma",
    email: "rohit.s@gyanyug.com",
    phone: "+91 98765 22334",
    department: "IT",
    designation: "Software Developer",
    joiningDate: "01 Mar, 2023",
    reportingManager: "Rahul Mehta (Tech Lead)",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Priya Singh",
    email: "priya.s@gyanyug.com",
    phone: "+91 98765 33445",
    department: "Content",
    designation: "Content Executive",
    joiningDate: "15 Jul, 2023",
    reportingManager: "Sarah Jenkins (Content Manager)",
    status: "Away",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Aman Verma",
    email: "aman.v@gyanyug.com",
    phone: "+91 98765 44556",
    department: "Academic",
    designation: "Academic Coordinator",
    joiningDate: "05 Aug, 2022",
    reportingManager: "Dr. Rajesh Kumar (Academic Head)",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
];

// =========================
// GET ALL EMPLOYEES
// =========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, department, sort } = req.query;

    let query = {};
    if (department && department !== "All Departments") {
      query.department = department;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { designation: searchRegex },
      ];
    }

    let sortOption = { name: 1 };
    if (sort === "desc") {
      sortOption = { name: -1 };
    }

    let employees = await Employee.find(query).sort(sortOption);

    if (employees.length === 0 && !search && (!department || department === "All Departments")) {
      employees = await Employee.insertMany(initialEmployeesSeed);
    }

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Fetch employees error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee directory.",
    });
  }
});

// =========================
// ADD NEW EMPLOYEE API
// =========================
router.post("/", authMiddleware, roleMiddleware("HR", "Admin"), async (req, res) => {
  try {
    const { name, email, phone, department, designation, joiningDate, reportingManager, status } = req.body;

    if (!name || !email || !designation || !department) {
      return res.status(400).json({
        success: false,
        message: "Please fill in Name, Email, Department and Designation.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmp = await Employee.findOne({ email: normalizedEmail });
    if (existingEmp) {
      return res.status(409).json({
        success: false,
        message: "Employee with this email already exists.",
      });
    }

    const newEmp = await Employee.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || "+91 98765 43210",
      department,
      designation: designation.trim(),
      joiningDate: joiningDate || "Today",
      reportingManager: reportingManager || "Alex Rivera",
      status: status || "Active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    });

    res.status(201).json({
      success: true,
      message: `Employee ${newEmp.name} added successfully.`,
      data: newEmp,
    });
  } catch (error) {
    console.error("Add employee error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add new employee.",
    });
  }
});

module.exports = router;
