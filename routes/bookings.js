const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async function (req, res) {
  let sql =
    "SELECT bookings.id, bookings.booking_date, bookings.slot, bookings.status, " +
    "students.name AS student_name, machines.name AS machine_name " +
    "FROM bookings " +
    "JOIN students ON bookings.student_id = students.id " +
    "JOIN machines ON bookings.machine_id = machines.id ";
  const values = [];

  if (req.query.date) {
    sql += "WHERE bookings.booking_date = ? ";
    values.push(req.query.date);
  }

  sql += "ORDER BY bookings.booking_date, bookings.slot";
  const [bookings] = await db.query(sql, values);
  res.json(bookings);
});

router.post("/", async function (req, res) {
  const { student_id, machine_id, booking_date, slot } = req.body;

  const [machines] = await db.query("SELECT status FROM machines WHERE id = ?", [machine_id]);
  if (machines[0].status === "repair") {
    return res.status(400).json({ message: "This machine is under repair" });
  }

  await db.query(
    "DELETE FROM bookings WHERE machine_id = ? AND booking_date = ? AND slot = ? AND status = 'cancelled'",
    [machine_id, booking_date, slot]
  );

  try {
    await db.query(
      "INSERT INTO bookings (student_id, machine_id, booking_date, slot) VALUES (?, ?, ?, ?)",
      [student_id, machine_id, booking_date, slot]
    );
    res.json({ message: "Booking done" });
  } catch (err) {
    res.status(400).json({ message: "This machine is already booked for that date and slot" });
  }
});

router.put("/:id/status", async function (req, res) {
  await db.query("UPDATE bookings SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
  res.json({ message: "Status updated" });
});

router.delete("/:id", async function (req, res) {
  await db.query("DELETE FROM bookings WHERE id = ?", [req.params.id]);
  res.json({ message: "Booking deleted" });
});

module.exports = router;
