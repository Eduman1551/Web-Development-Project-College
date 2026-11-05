const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async function (req, res) {
  const [machines] = await db.query("SELECT * FROM machines ORDER BY id");
  res.json(machines);
});

router.post("/", async function (req, res) {
  const { name, floor, status } = req.body;
  await db.query(
    "INSERT INTO machines (name, floor, status) VALUES (?, ?, ?)",
    [name, floor, status]
  );
  res.json({ message: "Machine added" });
});

router.put("/:id", async function (req, res) {
  const { name, floor, status } = req.body;
  await db.query(
    "UPDATE machines SET name = ?, floor = ?, status = ? WHERE id = ?",
    [name, floor, status, req.params.id]
  );
  res.json({ message: "Machine updated" });
});

router.delete("/:id", async function (req, res) {
  await db.query("DELETE FROM machines WHERE id = ?", [req.params.id]);
  res.json({ message: "Machine deleted" });
});

module.exports = router;
