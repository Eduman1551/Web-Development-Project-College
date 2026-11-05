const form = document.getElementById("machineForm");
const message = document.getElementById("message");
const table = document.getElementById("machineTable");
const cancelBtn = document.getElementById("cancelBtn");
const adminLink = document.getElementById("adminLink");

const adminPassword = sessionStorage.getItem("adminPassword");

let machines = [];

async function loadMachines() {
  const res = await fetch("/api/machines");
  machines = await res.json();

  table.innerHTML = "";
  for (let i = 0; i < machines.length; i++) {
    const m = machines[i];
    let buttons = "";
    if (adminPassword) {
      buttons =
        "<td>" +
        "<button onclick='editMachine(" + m.id + ")'>Edit</button> " +
        "<button class='red' onclick='deleteMachine(" + m.id + ")'>Delete</button>" +
        "</td>";
    }

    table.innerHTML +=
      "<tr>" +
      "<td>" + m.name + "</td>" +
      "<td>" + m.floor + "</td>" +
      "<td><span class='badge " + m.status + "'>" + m.status + "</span></td>" +
      buttons +
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
    headers: { "Content-Type": "application/json", "x-admin-password": adminPassword },
    body: JSON.stringify(machine)
  });
  const data = await res.json();
  message.textContent = data.message;

  if (res.ok) {
    resetForm();
    loadMachines();
  }
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
    const res = await fetch("/api/machines/" + id, {
      method: "DELETE",
      headers: { "x-admin-password": adminPassword }
    });
    const data = await res.json();
    message.textContent = data.message;
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

if (adminPassword) {
  document.getElementById("formCard").hidden = false;
  document.getElementById("actionsHeader").hidden = false;
  adminLink.textContent = "Logout";
  adminLink.href = "index.html";
  adminLink.addEventListener("click", function () {
    sessionStorage.removeItem("adminPassword");
  });
}

loadMachines();
