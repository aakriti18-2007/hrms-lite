const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ===== MONGOOSE SETUP =====
mongoose.connect("mongodb://127.0.0.1:27017/hrmslite")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// ===== SCHEMAS =====
const employeeSchema = new mongoose.Schema({
  empId: String,
  fullName: String,
  email: String,
  department: String
});

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: String,
  status: String
});

const Employee = mongoose.model("Employee", employeeSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);

// ===== API ROUTES =====

// Employees
app.get("/api/employees", async (req,res)=>{
  try{
    const employees = await Employee.find();
    res.json(employees);
  }catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/employees/add", async (req,res)=>{
  try{
    const { empId, fullName, email, department } = req.body;
    if(!empId || !fullName || !email || !department)
      return res.status(400).json({ message: "Fill all fields" });

    const newEmp = new Employee({ empId, fullName, email, department });
    await newEmp.save();
    res.status(201).json({ message: "Employee added", data: newEmp });
  }catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/employees/delete", async (req,res)=>{
  try{
    const id = req.query.id;
    await Employee.findByIdAndDelete(id);
    res.json({ message: "Employee deleted" });
  }catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

// Attendance
app.get("/api/attendance", async (req,res)=>{
  try{
    const attendance = await Attendance.find().populate("employee");
    res.json(attendance);
  }catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/attendance/add", async (req,res)=>{
  try{
    const { employee, date, status } = req.body;
    if(!employee || !date || !status)
      return res.status(400).json({ message: "Fill all fields" });

    const newAtt = new Attendance({ employee, date, status });
    await newAtt.save();
    const populatedAtt = await newAtt.populate("employee");
    res.status(201).json({ message: "Attendance marked", data: populatedAtt });
  }catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

// ===== FRONTEND =====
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));
app.get("/", (req,res)=>{
  res.json({ message: "HRMS Lite API is running" });
});


// ===== START SERVER =====
app.listen(PORT, ()=>{
  console.log(`Server running at http://localhost:${PORT}`);
});
