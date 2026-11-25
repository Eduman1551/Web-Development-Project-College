const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async function (req, res) {
  let sql =
    "SELECT bookings.id, bookings.student_id, bookings.booking_date, bookings.slot, bookings.status, " +
    "students.name AS student_name, machines.name AS machine_name " +
    "FROM bookings " +
    "JOIN students ON bookings.student_id = students.id " +
    "JOIN machines ON bookings.machine_id = machines.id ";
  const values = [];

  if (req.query.date) {
    sql += "WHERE bookings.booking_date = $1 ";
    values.push(req.query.date);
  }

  sql += "ORDER BY bookings.booking_date, bookings.slot";
  const result = await db.query(sql, values);
  res.json(result.rows);
});

router.post("/", async function (req, res) {
  const { machine_id, booking_date, slot } = req.body;

  const machines = await db.query("SELECT status FROM machines WHERE id = $1", [machine_id]);
  if (machines.rows[0].status === "repair") {
    return res.status(400).json({ message: "This machine is under repair" });
  }

  await db.query(
    "DELETE FROM bookings WHERE machine_id = $1 AND booking_date = $2 AND slot = $3 AND status = 'cancelled'",
    [machine_id, booking_date, slot]
  );

  try {
    await db.query(
      "INSERT INTO bookings (student_id, machine_id, booking_date, slot) VALUES ($1, $2, $3, $4)",
      [req.session.userId, machine_id, booking_date, slot]
    );
    res.json({ message: "Booking done" });
  } catch (err) {
    res.status(400).json({ message: "This machine is already booked for that date and slot" });
  }
});

router.put("/:id/status", async function (req, res) {
  const bookings = await db.query("SELECT student_id FROM bookings WHERE id = $1", [req.params.id]);
  if (bookings.rows.length === 0 || bookings.rows[0].student_id !== req.session.userId) {
    return res.status(403).json({ message: "This is not your booking" });
  }

  await db.query("UPDATE bookings SET status = $1 WHERE id = $2", [req.body.status, req.params.id]);
  res.json({ message: "Status updated" });
});

router.delete("/:id", async function (req, res) {
  const bookings = await db.query("SELECT student_id FROM bookings WHERE id = $1", [req.params.id]);
  const isOwner = bookings.rows.length > 0 && bookings.rows[0].student_id === req.session.userId;
  if (!isOwner && req.session.role !== "admin") {
    return res.status(403).json({ message: "This is not your booking" });
  }

  await db.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
  res.json({ message: "Booking deleted" });
});

module.exports = router;
