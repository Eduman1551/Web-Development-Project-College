const { Pool, types } = require("pg");
require("dotenv").config();

types.setTypeParser(1082, function (value) {
  return value;
});

const pool = new Pool({
  connectionString: process.env.NEONDB_CONN,
  ssl: true,
  max: 3
});

pool.on("error", function (err) {
  console.log("Database error: " + err.message);
});

module.exports = pool;
