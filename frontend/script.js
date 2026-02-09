// ===== BASE URL =====
const BASE = "https://hrms-lite-production-fe09.up.railway.app";
const EMP_API = `${BASE}/api/employees`;
const ATT_API = `${BASE}/api/attendance`;

// ===== LOAD EMPLOYEES =====
async function loadEmployees() {
  try {
    const res = await fetch(EMP_API);
    const data = await res.json();

    const table = document.getElementById("empTable");
    const select = document.getElementById("empSelect");

    table.innerHTML = "";
    select.innerHTML = "<option value=''>Select Employee</option>";

    data.forEach(e => {
      table.innerHTML += `
        <tr>
          <td>${e.empId}</td>
          <td>${e.fullName}</td>
          <td>${e.email}</td>
          <td>${e.department}</td>
          <td><button onclick="deleteEmployee('${e._id}')">Delete</button></td>
        </tr>`;

      select.innerHTML += `<option value="${e._id}">${e.fullName}</option>`;
    });
  } catch (err) {
    console.error(err);
    alert("Error loading employees");
  }
}

// ===== ADD EMPLOYEE =====
document.getElementById("employeeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const empId = document.getElementById("empIdInput").value.trim();
  const fullName = document.getElementById("fullNameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const department = document.getElementById("departmentInput").value.trim();

  if (!empId || !fullName || !email || !department) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch(`${EMP_API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ empId, fullName, email, department })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error adding employee");

    document.getElementById("employeeForm").reset();
    loadEmployees();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

// ===== DELETE EMPLOYEE =====
async function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  try {
    const res = await fetch(`${EMP_API}/delete?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error deleting employee");

    alert("Employee deleted successfully!");
    loadEmployees();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// ===== LOAD ATTENDANCE =====
async function loadAttendance() {
  try {
    const res = await fetch(ATT_API);
    const data = await res.json();

    const table = document.getElementById("attTable");
    table.innerHTML = "";

    data.forEach(a => {
      table.innerHTML += `
        <tr>
          <td>${a.employee?.fullName || "N/A"}</td>
          <td>${a.date}</td>
          <td>${a.status}</td>
        </tr>`;
    });
  } catch (err) {
    console.error(err);
    alert("Error loading attendance");
  }
}

// ===== MARK ATTENDANCE =====
document.getElementById("attendanceForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const employee = document.getElementById("empSelect").value;
  const date = document.getElementById("attDate").value;
  const status = document.getElementById("status").value;

  if (!employee || !date || !status) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch(`${ATT_API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee, date, status })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error marking attendance");

    document.getElementById("attendanceForm").reset();
    loadAttendance();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

// ===== INITIAL LOAD =====
window.onload = () => {
  loadEmployees();
  loadAttendance();
};
