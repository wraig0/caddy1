const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.send(`Current time from DB: ${result.rows[0].now}`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
