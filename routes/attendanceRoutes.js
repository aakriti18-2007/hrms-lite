const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// mark attendance
router.post("/mark", async (req, res) => {
  try {
    const { empId, date, status } = req.body;

    const exists = await Attendance.findOne({ empId, date });
    if (exists) return res.status(400).json({ message: "Already marked" });

    const record = new Attendance({ empId, date, status });
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all attendance
router.get("/", async (req, res) => {
  const records = await Attendance.find();
  res.json(records);
});

module.exports = router;
