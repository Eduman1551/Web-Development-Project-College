const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roll_no: document.getElementById("rollNo").value,
      password: document.getElementById("password").value
    })
  });
  const data = await res.json();

  if (res.ok) {
    window.location.href = "index.html";
  } else {
    message.textContent = data.message;
  }
});
