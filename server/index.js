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
const db = new sqlite3.Database('scheduler.db');

createTables();


// Insert a new mentor
app.post('/mentors', (req, res) => {
  const { name, availability, areas_of_expertise, is_premium,bookings=[],availability_start,availability_end } = req.body;

  // Convert areas_of_expertise array to JSON string
  const expertiseJson = JSON.stringify(areas_of_expertise);
  const bookingsJson = JSON.stringify(bookings)

  db.run(
    `INSERT INTO mentors (name, availability, areas_of_expertise, is_premium,bookings,availability_start,availability_end) VALUES (?,?,?, ?, ?, ?,?)`,
    [name, availability, expertiseJson, is_premium ? 1 : 0,bookingsJson,availability_start,availability_end],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, availability, areas_of_expertise, is_premium,bookingsJson,availability_start,availability_end });
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

app.get("/bookings/student/:id",(req,res)=>{
  const studentId = req.params.id
  db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, row)=>{
    if(err){
      return res.status(500).json({error:err.message})
    }
    if(!row){
      return res.status(404).json({error : 'Student not found'})
    }
    res.json(row)
  })
})

app.get("/bookings/mentor/:id",(req,res)=>{
  const mentorId = req.params.id
  db.get('SELECT * FROM mentors WHERE id = ?', [mentorId], (err, row)=>{
    if(err){
      return res.status(500).json({error:err.message})
    }
    if(!row){
      return res.status(404).json({error : 'Mentor not found'})
    }
    res.json(row)
  })
})
// Get all students
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// Update bookings for a mentor
app.put('/mentors/:id/bookings', (req, res) => {
  const mentorId = req.params.id;
  const { availability_end,availability_start,bookings=[] } = req.body;

  // Convert bookings array to JSON string

  db.run(
    `UPDATE mentors 
     SET availability_start = ?, availability_end = ?
     WHERE id = ?`,
    [availability_start,availability_end , mentorId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Mentor not found' });
      }
      res.json({ message: 'Bookings updated successfully', id: mentorId });
    }
  );
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
        return res.status(404).json({ error: 'students not found' });
      }
      res.status(200).json({ message: 'students deleted successfully' });
    }
  );
});

// Start the server



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
