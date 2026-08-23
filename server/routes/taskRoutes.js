const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Employees see only tasks assigned to them.
// HR/Admin may see all tasks.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter =
      ["HR", "Admin"].includes(req.user.role)
        ? {}
        : { assignedUserId: req.user.id };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Fetch tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load task board.",
    });
  }
});

// HR/Admin can create a task
router.post("/", authMiddleware, roleMiddleware("HR", "Admin"), async (req, res) => {
  try {
    const {
      title,
      description = "",
      priority = "Standard",
      assignedUserId,
      assignedTo = "",
      assignedRole = "Team",
      dueDate,
    } = req.body;

    if (!title || !dueDate || !assignedUserId) {
      return res.status(400).json({
        success: false,
        message: "Title, due date and assigned employee are required.",
      });
    }

    const task = await Task.create({
      taskId: `#TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      tag: priority === "High" ? "HIGH" : "STANDARD",
      assignedUserId,
      assignedTo,
      assignedRole,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task.",
    });
  }
});

// Assigned employee or HR/Admin can update status
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const isPrivileged = ["HR", "Admin"].includes(req.user.role);
    const isAssignee = task.assignedUserId?.toString() === req.user.id;

    if (!isPrivileged && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this task.",
      });
    }

    const { status, tag, isCompleted } = req.body;

    if (status) task.status = status;
    if (tag) task.tag = tag;
    if (typeof isCompleted === "boolean") task.isCompleted = isCompleted;

    await task.save();

    res.json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task.",
    });
  }
});

module.exports = router;
