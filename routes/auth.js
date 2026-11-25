const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

router.post("/register", async function (req, res) {
  const { name, roll_no, room_no, phone, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      "INSERT INTO students (name, roll_no, room_no, phone, password) VALUES ($1, $2, $3, $4, $5)",
      [name, roll_no, room_no, phone, hash]
    );
    res.json({ message: "Registered, now please login" });
  } catch (err) {
    res.status(400).json({ message: "Roll no already exists" });
  }
});

router.post("/login", async function (req, res) {
  const { roll_no, password } = req.body;
  const result = await db.query("SELECT * FROM students WHERE roll_no = $1", [roll_no]);
  const student = result.rows[0];

  if (student && (await bcrypt.compare(password, student.password))) {
    req.session.userId = student.id;
    req.session.role = student.role;
    res.json({ message: "Login done" });
  } else {
    res.status(401).json({ message: "Wrong roll no or password" });
  }
});

router.post("/logout", function (req, res) {
  req.session = null;
  res.json({ message: "Logged out" });
});

router.get("/me", async function (req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const result = await db.query(
    "SELECT id, name, role FROM students WHERE id = $1",
    [req.session.userId]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Not logged in" });
  }
  res.json(result.rows[0]);
});

module.exports = router;
