const form = document.getElementById("studentForm");
const message = document.getElementById("message");
const table = document.getElementById("studentTable");
const cancelBtn = document.getElementById("cancelBtn");

let students = [];

async function loadStudents() {
  const res = await fetch("/api/students");
  students = await res.json();

  table.innerHTML = "";
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    table.innerHTML +=
      "<tr>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.roll_no + "</td>" +
      "<td>" + s.room_no + "</td>" +
      "<td>" + (s.phone || "") + "</td>" +
      "<td>" +
      "<button onclick='editStudent(" + s.id + ")'>Edit</button> " +
      "<button class='red' onclick='deleteStudent(" + s.id + ")'>Delete</button>" +
      "</td>" +
      "</tr>";
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("studentId").value;
  const student = {
    name: document.getElementById("name").value,
    roll_no: document.getElementById("rollNo").value,
    room_no: document.getElementById("roomNo").value,
    phone: document.getElementById("phone").value
  };

  let url = "/api/students";
  let method = "POST";
  if (id) {
    url = "/api/students/" + id;
    method = "PUT";
  }

  const res = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
  const data = await res.json();
  message.textContent = data.message;

  if (res.ok) {
    resetForm();
    loadStudents();
  }
});

function editStudent(id) {
  const student = students.find(function (s) {
    return s.id === id;
  });

  document.getElementById("studentId").value = student.id;
  document.getElementById("name").value = student.name;
  document.getElementById("rollNo").value = student.roll_no;
  document.getElementById("roomNo").value = student.room_no;
  document.getElementById("phone").value = student.phone || "";

  document.getElementById("formTitle").textContent = "Edit Student";
  document.getElementById("saveBtn").textContent = "Update Student";
  cancelBtn.hidden = false;
}

async function deleteStudent(id) {
  if (confirm("Delete this student? Their bookings will also be deleted.")) {
    await fetch("/api/students/" + id, { method: "DELETE" });
    loadStudents();
  }
}

function resetForm() {
  form.reset();
  document.getElementById("studentId").value = "";
  document.getElementById("formTitle").textContent = "Add Student";
  document.getElementById("saveBtn").textContent = "Add Student";
  cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

const adminLink = document.getElementById("adminLink");
if (sessionStorage.getItem("adminPassword")) {
  adminLink.textContent = "Logout";
  adminLink.href = "index.html";
  adminLink.addEventListener("click", function () {
    sessionStorage.removeItem("adminPassword");
  });
}

loadStudents();
