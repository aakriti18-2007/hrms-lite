const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

router.post("/add", async (req, res) => {
  try {
    const { empId, fullName, email, department } = req.body;

    const newEmp = new Employee({ empId, fullName, email, department });
    await newEmp.save();

    res.json(newEmp);
  } catch (err) {
    res.status(500).json({ message: "Failed to add" });
  }
});

module.exports = router;
// DELETE employee by id
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
