const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
const port = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query(
  `CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
  )`
);

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.send(`Current time from DB: ${result.rows[0].now}`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/todo", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos LIMIT 1000");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving todos");
  }
});

app.post("/todo", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).send("Title and description are required");
  }

  try {
    const result = await pool.query(
      "INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating todo");
  }
});
