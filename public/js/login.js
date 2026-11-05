const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const adminLink = document.getElementById("adminLink");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: password })
  });
  const data = await res.json();

  if (res.ok) {
    sessionStorage.setItem("adminPassword", password);
    window.location.href = "machines.html";
  } else {
    message.textContent = data.message;
  }
});

if (sessionStorage.getItem("adminPassword")) {
  adminLink.textContent = "Logout";
  adminLink.href = "index.html";
  adminLink.addEventListener("click", function () {
    sessionStorage.removeItem("adminPassword");
  });
}
