let currentUser = null;

const authLinks = document.getElementById("authLinks");
const page = window.location.pathname;

async function loadUser() {
  const res = await fetch("/api/me");

  if (res.ok) {
    currentUser = await res.json();
    authLinks.innerHTML = "<a href='#' id='logoutLink'>Logout</a>";
    document.getElementById("logoutLink").addEventListener("click", logout);
  } else {
    authLinks.innerHTML = "<a href='login.html'>Login</a><a href='register.html'>Register</a>";
    if (!page.endsWith("login.html") && !page.endsWith("register.html")) {
      window.location.href = "login.html";
    }
  }
}

async function logout(e) {
  e.preventDefault();
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "login.html";
}

const userReady = loadUser();
