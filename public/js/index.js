const table = document.getElementById("todayTable");

async function loadStats() {
  const res = await fetch("/api/stats");
  const stats = await res.json();

  document.getElementById("totalStudents").textContent = stats.students;
  document.getElementById("totalMachines").textContent = stats.machines;
  document.getElementById("bookingsToday").textContent = stats.bookingsToday;
}

async function loadTodayBookings() {
  const today = new Date().toLocaleDateString("en-CA");
  const res = await fetch("/api/bookings?date=" + today);
  const bookings = await res.json();

  table.innerHTML = "";
  if (bookings.length === 0) {
    table.innerHTML = "<tr><td colspan='4'>No bookings today</td></tr>";
  }

  for (let i = 0; i < bookings.length; i++) {
    const b = bookings[i];
    table.innerHTML +=
      "<tr>" +
      "<td>" + b.student_name + "</td>" +
      "<td>" + b.machine_name + "</td>" +
      "<td>" + b.slot + "</td>" +
      "<td>" + b.status + "</td>" +
      "</tr>";
  }
}

loadStats();
loadTodayBookings();
