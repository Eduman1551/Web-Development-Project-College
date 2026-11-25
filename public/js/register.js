const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      roll_no: document.getElementById("rollNo").value,
      room_no: document.getElementById("roomNo").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value
    })
  });
  const data = await res.json();
  message.textContent = data.message;

  if (res.ok) {
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1000);
  }
});
