const express = require("express");
const db = require("../db");

const router = express.Router();

function checkAdmin(req, res, next) {
  if (req.session.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Only the admin can do this" });
  }
}

router.get("/", async function (req, res) {
  const result = await db.query("SELECT * FROM machines ORDER BY id");
  res.json(result.rows);
});

router.post("/", checkAdmin, async function (req, res) {
  const { name, floor, status } = req.body;
  await db.query(
    "INSERT INTO machines (name, floor, status) VALUES ($1, $2, $3)",
    [name, floor, status]
  );
  res.json({ message: "Machine added" });
});

router.put("/:id", checkAdmin, async function (req, res) {
  const { name, floor, status } = req.body;
  await db.query(
    "UPDATE machines SET name = $1, floor = $2, status = $3 WHERE id = $4",
    [name, floor, status, req.params.id]
  );
  res.json({ message: "Machine updated" });
});

router.delete("/:id", checkAdmin, async function (req, res) {
  await db.query("DELETE FROM machines WHERE id = $1", [req.params.id]);
  res.json({ message: "Machine deleted" });
});

module.exports = router;
