const express = require("express");
const Request = require("../models/Request");

const router = express.Router();

console.log("REQUEST ROUTES FILE LOADED");



// Create Service Request
router.post("/", async (req, res) => {
  try {
    const {
      student,
      title,
      description,
      category,
      location,
      priority,
    } = req.body;

    if (
      !student ||
      !title ||
      !description ||
      !category ||
      !location
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const request = await Request.create({
      student,
      title,
      description,
      category,
      location,
      priority: priority || "Medium",
      status: "Pending",
    });

    res.status(201).json({
      message: "Service request created successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create service request",
      error: error.message,
    });
  }
});

// Get requests of a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const requests = await Request.find({
      student: req.params.studentId,
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
});

// Test Route
router.get("/test", (req, res) => {
  res.json({
    message: "Request routes are working!",
  });
});

module.exports = router;