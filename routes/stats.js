const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async function (req, res) {
  const students = await db.query("SELECT COUNT(*)::int AS total FROM students WHERE role = 'student'");
  const machines = await db.query("SELECT COUNT(*)::int AS total FROM machines");
  const bookings = await db.query(
    "SELECT COUNT(*)::int AS total FROM bookings WHERE booking_date = (NOW() AT TIME ZONE 'Asia/Kolkata')::date"
  );

  res.json({
    students: students.rows[0].total,
    machines: machines.rows[0].total,
    bookingsToday: bookings.rows[0].total
  });
});

module.exports = router;
