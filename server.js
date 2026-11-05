const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/students", require("./routes/students"));
app.use("/api/machines", require("./routes/machines"));
app.use("/api/bookings", require("./routes/bookings"));

app.listen(3000, function () {
  console.log("Server running on Port 3000...");
});
