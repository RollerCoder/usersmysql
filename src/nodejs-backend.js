// File: server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Create a new user
app.post('/users', (req, res) => {
  const { FirstName, LastName, EmailAddress } = req.body;
  const query = 'INSERT INTO users (FirstName, LastName, EmailAddress) VALUES (?, ?, ?)';
  db.query(query, [FirstName, LastName, EmailAddress], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, FirstName, LastName, EmailAddress });
  });
});

// Read users with pagination
app.get('/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const offset = (page - 1) * perPage;

  const query = 'SELECT * FROM users LIMIT ? OFFSET ?';
  db.query(query, [perPage, offset], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    db.query('SELECT COUNT(*) AS count FROM users', (countErr, countResults) => {
      if (countErr) {
        res.status(500).json({ error: countErr.message });
        return;
      }
      const totalUsers = countResults[0].count;
      const totalPages = Math.ceil(totalUsers / perPage);

      res.json({
        users: results,
        currentPage: page,
        totalPages: totalPages,
        totalUsers: totalUsers,
      });
    });
  });
});

// Update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { FirstName, LastName, EmailAddress } = req.body;
  const query = 'UPDATE users SET FirstName = ?, LastName = ?, EmailAddress = ? WHERE id = ?';
  db.query(query, [FirstName, LastName, EmailAddress, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ id, FirstName, LastName, EmailAddress });
  });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
