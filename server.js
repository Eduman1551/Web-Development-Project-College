const express = require("express");
const cookieSession = require("cookie-session");
require("dotenv").config();
const requireLogin = require("./requireLogin");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.use(
  cookieSession({
    secret: process.env.SESSION_SECRET,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  })
);

app.use("/api", require("./routes/auth"));
app.use("/api", requireLogin);

app.use("/api/students", require("./routes/students"));
app.use("/api/machines", require("./routes/machines"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/stats", require("./routes/stats"));

app.use(function (err, req, res, next) {
  console.log(err.message);
  res.status(err.status || 500).json({ message: "Something went wrong" });
});

if (require.main === module) {
  app.listen(3000, function () {
    console.log("Server running on Port 3000...");
  });
}

module.exports = app;
