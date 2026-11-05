const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async function (req, res) {
  const [students] = await db.query("SELECT * FROM students ORDER BY id");
  res.json(students);
});

router.post("/", async function (req, res) {
  const { name, roll_no, room_no, phone } = req.body;
  try {
    await db.query(
      "INSERT INTO students (name, roll_no, room_no, phone) VALUES (?, ?, ?, ?)",
      [name, roll_no, room_no, phone]
    );
    res.json({ message: "Student added" });
  } catch (err) {
    res.status(400).json({ message: "Roll no already exists" });
  }
});

router.put("/:id", async function (req, res) {
  const { name, roll_no, room_no, phone } = req.body;
  try {
    await db.query(
      "UPDATE students SET name = ?, roll_no = ?, room_no = ?, phone = ? WHERE id = ?",
      [name, roll_no, room_no, phone, req.params.id]
    );
    res.json({ message: "Student updated" });
  } catch (err) {
    res.status(400).json({ message: "Roll no already exists" });
  }
});

router.delete("/:id", async function (req, res) {
  await db.query("DELETE FROM students WHERE id = ?", [req.params.id]);
  res.json({ message: "Student deleted" });
});

module.exports = router;
