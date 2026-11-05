const form = document.getElementById("machineForm");
const message = document.getElementById("message");
const table = document.getElementById("machineTable");
const cancelBtn = document.getElementById("cancelBtn");

let machines = [];

async function loadMachines() {
  const res = await fetch("/api/machines");
  machines = await res.json();

  table.innerHTML = "";
  for (let i = 0; i < machines.length; i++) {
    const m = machines[i];
    table.innerHTML +=
      "<tr>" +
      "<td>" + m.name + "</td>" +
      "<td>" + m.floor + "</td>" +
      "<td>" + m.status + "</td>" +
      "<td>" +
      "<button onclick='editMachine(" + m.id + ")'>Edit</button> " +
      "<button class='red' onclick='deleteMachine(" + m.id + ")'>Delete</button>" +
      "</td>" +
      "</tr>";
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("machineId").value;
  const machine = {
    name: document.getElementById("name").value,
    floor: document.getElementById("floor").value,
    status: document.getElementById("status").value
  };

  let url = "/api/machines";
  let method = "POST";
  if (id) {
    url = "/api/machines/" + id;
    method = "PUT";
  }

  const res = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(machine)
  });
  const data = await res.json();
  message.textContent = data.message;

  resetForm();
  loadMachines();
});

function editMachine(id) {
  const machine = machines.find(function (m) {
    return m.id === id;
  });

  document.getElementById("machineId").value = machine.id;
  document.getElementById("name").value = machine.name;
  document.getElementById("floor").value = machine.floor;
  document.getElementById("status").value = machine.status;

  document.getElementById("formTitle").textContent = "Edit Machine";
  document.getElementById("saveBtn").textContent = "Update Machine";
  cancelBtn.hidden = false;
}

async function deleteMachine(id) {
  if (confirm("Delete this machine? Its bookings will also be deleted.")) {
    await fetch("/api/machines/" + id, { method: "DELETE" });
    loadMachines();
  }
}

function resetForm() {
  form.reset();
  document.getElementById("machineId").value = "";
  document.getElementById("formTitle").textContent = "Add Machine";
  document.getElementById("saveBtn").textContent = "Add Machine";
  cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

loadMachines();
