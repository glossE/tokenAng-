const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'token_demo',
  password: 'root',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Your existing routes...

// Example endpoint for fetching names from PostgreSQL
app.get('/autocomplete', async (req, res) => {
    const { q } = req.query;
  
    try {
      const result = await pool.query('SELECT name FROM names WHERE name ILIKE $1', [`%${q}%`]);
      res.json(result.rows.map(row => row.name));
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Example endpoint for adding a name to PostgreSQL
app.post('/names', async (req, res) => {
  const { name } = req.body;

  try {
    await pool.query('INSERT INTO names (name) VALUES ($1)', [name]);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error adding name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
