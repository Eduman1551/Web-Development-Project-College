const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async function (req, res) {
  const result = await db.query(
    "SELECT id, name, roll_no, room_no, phone FROM students WHERE role = 'student' ORDER BY id"
  );
  res.json(result.rows);
});

router.put("/:id", async function (req, res) {
  if (Number(req.params.id) !== req.session.userId) {
    return res.status(403).json({ message: "You can edit only your own entry" });
  }

  const { name, roll_no, room_no, phone } = req.body;
  try {
    await db.query(
      "UPDATE students SET name = $1, roll_no = $2, room_no = $3, phone = $4 WHERE id = $5",
      [name, roll_no, room_no, phone, req.params.id]
    );
    res.json({ message: "Student updated" });
  } catch (err) {
    res.status(400).json({ message: "Roll no already exists" });
  }
});

router.delete("/:id", async function (req, res) {
  if (Number(req.params.id) !== req.session.userId) {
    return res.status(403).json({ message: "You can delete only your own entry" });
  }

  await db.query("DELETE FROM students WHERE id = $1", [req.params.id]);
  req.session = null;
  res.json({ message: "Student deleted" });
});

module.exports = router;
