const express = require("express");
const Request = require("../models/Request");


const router = express.Router();

console.log("ADMIN ROUTES FILE LOADED");

// Get all staff users
router.get("/staff", async (req, res) => {
  try {
    const User = require("../models/User");

    const staffUsers = await User.find(
      { role: "staff" },
      "name email"
    );

    res.json(staffUsers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch staff users",
      error: error.message,
    });
  }
});

// Get all service requests
router.get("/requests", async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("student", "name email")
      .populate("assigned_staff", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all requests",
      error: error.message,
    });
  }
});

// Assign staff to request
router.put("/requests/:id/staff", async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        message: "Please select a staff member",
      });
    }

    const User = require("../models/User");

    const staff = await User.findOne({
      _id: staffId,
      role: "staff",
    });

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        assigned_staff: staffId,
      },
      { new: true }
    )
      .populate("student", "name email")
      .populate("assigned_staff", "name email");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.json({
      message: "Staff assigned successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign staff",
      error: error.message,
    });
  }
});

// Update request status
router.put("/requests/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.json({
      message: "Request status updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update request status",
      error: error.message,
    });
  }
});

router.get("/test", (req, res) => {
  res.json({
    message: "Admin routes are working!",
  });
});

module.exports = router;