const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// create admin (run once)
router.post("/create", async (req, res) => {
  const admin = new Admin(req.body);
  await admin.save();
  res.json({ message: "Admin created" });
});

// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username, password });
  if (!admin) return res.status(401).json({ message: "Invalid login" });

  res.json({ message: "Login success" });
});

module.exports = router;
