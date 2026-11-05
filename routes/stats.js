const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async function (req, res) {
  const [students] = await db.query("SELECT COUNT(*) AS total FROM students");
  const [machines] = await db.query("SELECT COUNT(*) AS total FROM machines");
  const [bookings] = await db.query("SELECT COUNT(*) AS total FROM bookings WHERE booking_date = CURDATE()");

  res.json({
    students: students[0].total,
    machines: machines[0].total,
    bookingsToday: bookings[0].total
  });
});

module.exports = router;
