const form = document.getElementById("studentForm");
const message = document.getElementById("message");
const table = document.getElementById("studentTable");
const formCard = document.getElementById("formCard");

let students = [];

async function loadStudents() {
  const res = await fetch("/api/students");
  students = await res.json();

  table.innerHTML = "";
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    let buttons = "";
    if (s.id === currentUser.id) {
      buttons =
        "<button onclick='editStudent(" + s.id + ")'>Edit</button> " +
        "<button class='red' onclick='deleteStudent(" + s.id + ")'>Delete</button>";
    }

    table.innerHTML +=
      "<tr>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.roll_no + "</td>" +
      "<td>" + s.room_no + "</td>" +
      "<td>" + (s.phone || "") + "</td>" +
      "<td>" + buttons + "</td>" +
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

  const res = await fetch("/api/students/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
  const data = await res.json();
  message.textContent = data.message;

  if (res.ok) {
    formCard.hidden = true;
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

  formCard.hidden = false;
}

async function deleteStudent(id) {
  if (confirm("Delete your account? Your bookings will also be deleted.")) {
    await fetch("/api/students/" + id, { method: "DELETE" });
    window.location.href = "login.html";
  }
}

document.getElementById("cancelBtn").addEventListener("click", function () {
  formCard.hidden = true;
});

userReady.then(function () {
  if (currentUser) {
    loadStudents();
  }
});
