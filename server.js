const express = require("express");
const session = require("express-session");
require("dotenv").config();
const requireLogin = require("./requireLogin");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  })
);

app.use("/api", require("./routes/auth"));
app.use("/api", requireLogin);

app.use("/api/students", require("./routes/students"));
app.use("/api/machines", require("./routes/machines"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/stats", require("./routes/stats"));

app.listen(3000, function () {
  console.log("Server running on Port 3000...");
});
