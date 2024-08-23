const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite3 database
const db = new sqlite3.Database('database.db');

const createTables = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS mentors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        availability TEXT NOT NULL,
        areas_of_expertise TEXT NOT NULL,
        is_premium BOOLEAN DEFAULT 0,
        bookings TEXT DEFAULT '[]'
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        availability TEXT NOT NULL,
        area_of_interest TEXT NOT NULL,
        bookings TEXT DEFAULT '[]'
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        mentor_id INTEGER NOT NULL,
        booking_time TEXT NOT NULL,
        FOREIGN KEY(student_id) REFERENCES students(id),
        FOREIGN KEY(mentor_id) REFERENCES mentors(id)
      )
    `);
  });
};

module.exports = { createTables };
