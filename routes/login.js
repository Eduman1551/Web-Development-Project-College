const express = require("express");

const router = express.Router();

router.post("/", function (req, res) {
  const password = req.body.password;

  if (password && password === process.env.ADMIN_PASSWORD) {
    res.json({ message: "Login done" });
  } else {
    res.status(401).json({ message: "Wrong password" });
  }
});

module.exports = router;
