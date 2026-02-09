const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  empId: String,
  fullName: String,
  email: String,
  department: String
});

module.exports = mongoose.model("Employee", EmployeeSchema);
