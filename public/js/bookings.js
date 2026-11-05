const slots = [
  "06:00-08:00",
  "08:00-10:00",
  "10:00-12:00",
  "16:00-18:00",
  "18:00-20:00",
  "20:00-22:00"
];

const form = document.getElementById("bookingForm");
const message = document.getElementById("message");
const table = document.getElementById("bookingTable");
const filterDate = document.getElementById("filterDate");

async function loadDropdowns() {
  const studentsRes = await fetch("/api/students");
  const students = await studentsRes.json();
  for (let i = 0; i < students.length; i++) {
    document.getElementById("student").innerHTML +=
      "<option value='" + students[i].id + "'>" + students[i].name + " (" + students[i].roll_no + ")</option>";
  }

  const machinesRes = await fetch("/api/machines");
  const machines = await machinesRes.json();
  for (let i = 0; i < machines.length; i++) {
    let text = machines[i].name;
    if (machines[i].status === "repair") {
      text += " (under repair)";
    }
    document.getElementById("machine").innerHTML +=
      "<option value='" + machines[i].id + "'>" + text + "</option>";
  }

  for (let i = 0; i < slots.length; i++) {
    document.getElementById("slot").innerHTML +=
      "<option value='" + slots[i] + "'>" + slots[i] + "</option>";
  }
}

async function loadBookings() {
  let url = "/api/bookings";
  if (filterDate.value) {
    url += "?date=" + filterDate.value;
  }

  const res = await fetch(url);
  const bookings = await res.json();

  table.innerHTML = "";
  for (let i = 0; i < bookings.length; i++) {
    const b = bookings[i];
    let buttons = "";
    if (b.status === "booked") {
      buttons =
        "<button class='green' onclick='changeStatus(" + b.id + ", \"done\")'>Done</button> " +
        "<button class='red' onclick='changeStatus(" + b.id + ", \"cancelled\")'>Cancel</button>";
    }

    table.innerHTML +=
      "<tr>" +
      "<td>" + b.student_name + "</td>" +
      "<td>" + b.machine_name + "</td>" +
      "<td>" + b.booking_date + "</td>" +
      "<td>" + b.slot + "</td>" +
      "<td><span class='badge " + b.status + "'>" + b.status + "</span></td>" +
      "<td>" + buttons + "</td>" +
      "</tr>";
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const booking = {
    student_id: document.getElementById("student").value,
    machine_id: document.getElementById("machine").value,
    booking_date: document.getElementById("date").value,
    slot: document.getElementById("slot").value
  };

  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking)
  });
  const data = await res.json();
  message.textContent = data.message;

  loadBookings();
});

async function changeStatus(id, status) {
  await fetch("/api/bookings/" + id + "/status", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: status })
  });
  loadBookings();
}

filterDate.addEventListener("change", loadBookings);

document.getElementById("showAllBtn").addEventListener("click", function () {
  filterDate.value = "";
  loadBookings();
});

document.getElementById("date").min = new Date().toLocaleDateString("en-CA");

const adminLink = document.getElementById("adminLink");
if (sessionStorage.getItem("adminPassword")) {
  adminLink.textContent = "Logout";
  adminLink.href = "index.html";
  adminLink.addEventListener("click", function () {
    sessionStorage.removeItem("adminPassword");
  });
}

loadDropdowns();
loadBookings();
