const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const { createTables } = require('./createTables');
const { upsertStudent, insertBooking } = require('./dbHelpers');

// Initialize Express app
const app = express();
const port = 3005; // Use environment variable or default to 3005

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the origin of your frontend
  credentials: true, // Allow credentials (cookies, HTTP authentication)
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Connect to SQLite3 database
const db = new sqlite3.Database('database.db');

createTables();


// Insert a new mentor
app.post('/mentors', (req, res) => {
  const { name, availability, areas_of_expertise, is_premium,bookings=[] } = req.body;

  // Convert areas_of_expertise array to JSON string
  const expertiseJson = JSON.stringify(areas_of_expertise);
  const bookingsJson = JSON.stringify(bookings)

  db.run(
    `INSERT INTO mentors (name, availability, areas_of_expertise, is_premium,bookings) VALUES (?, ?, ?, ?,?)`,
    [name, availability, expertiseJson, is_premium ? 1 : 0,bookingsJson],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, availability, areas_of_expertise, is_premium,bookingsJson });
    }
  );
});

// Insert or update a student
app.post('/students', (req, res) => {
  upsertStudent(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// Insert a booking
app.post('/bookings', (req, res) => {
  insertBooking(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});


// Get all mentors
app.get('/mentors', (req, res) => {
  db.all('SELECT * FROM mentors', [], (err, rows) => {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Parse areas_of_expertise JSON string back into array
    const mentors = rows.map(row => ({
      ...row,
      areas_of_expertise: JSON.parse(row.areas_of_expertise)
    }));

    res.json(mentors);
  });
});

app.get('/mentors/:id', (req, res) => {
  const mentorId = req.params.id;
  db.get('SELECT * FROM mentors WHERE id = ?', [mentorId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json(row);
  });
});
// Get all students
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  db.run(
    `DELETE FROM students WHERE id = ?`,
    [studentId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'student not found' });
      }
      res.status(200).json({ message: 'student deleted successfully' });
    }
  );
});

// Start the server



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
