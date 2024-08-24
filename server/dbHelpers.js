const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('scheduler.db');

// Helper function to insert or update a student
const upsertStudent = (studentData, callback) => {
  const { name, availability, area_of_interest, bookings = [] } = studentData;
  const bookingsJson = JSON.stringify(bookings);

  // Check if the student already exists
  db.get('SELECT id FROM students WHERE name = ?', [name], (err, row) => {
    if (err) {
      return callback(err);
    }
    if (row) {
      // If student exists, update the area_of_interest
      db.run(
        `UPDATE students SET availability = ?, area_of_interest = ?, bookings = ? WHERE id = ?`,
        [availability, area_of_interest, bookingsJson, row.id],
        function (err) {
          if (err) {
            return callback(err);
          }
          callback(null, { message: 'Student updated successfully', id: row.id });
        }
      );
    } else {
      // If student does not exist, create a new record
      db.run(
        `INSERT INTO students (name, availability, area_of_interest, bookings) VALUES (?, ?, ?, ?)`,
        [name, availability, area_of_interest, bookingsJson],
        function (err) {
          if (err) {
            return callback(err);
          }
          callback(null, { message: 'Student created successfully', id: this.lastID });
        }
      );
    }
  });
};



// Helper function to insert a booking
const insertBooking = (bookingData, callback) => {
  const { student_id, mentor_id, booking_time,duration } = bookingData;

  // Fetch the student and mentor names before inserting the booking
  db.get('SELECT name FROM students WHERE id = ?', [student_id], (err, student) => {
    if (err) {
      return callback(err);
    }

    db.get('SELECT * FROM mentors WHERE id = ?', [mentor_id], (err, mentor) => {
      if (err) {
        return callback(err);
      }

      const student_name = student.name;
      const mentor_name = mentor.name;
      const bookingDetails = { student_name, mentor_name, booking_time,duration };
      

      // Insert the booking into the bookings table

      db.run(
        `INSERT INTO bookings (student_id, mentor_id, booking_time) VALUES (?, ?, ?)`,
        [student_id, mentor_id, booking_time],
        function (err) {
          if (err) {
            return callback(err);
          }

          const bookingId = this.lastID;

          // Update student's bookings
          db.get('SELECT bookings FROM students WHERE id = ?', [student_id], (err, student) => {
            if (err) {
              return callback(err);
            }
            const studentBookings = student.bookings ? JSON.parse(student.bookings) : [];

            studentBookings.push(bookingDetails);

            db.run('UPDATE students SET bookings = ? WHERE id = ?', [JSON.stringify(studentBookings), student_id], (err) => {
              if (err) {
                return callback(err);
              }

              // Update mentor's bookings
              db.get('SELECT bookings FROM mentors WHERE id = ?', [mentor_id], (err, mentor) => {
                if (err) {
                  return callback(err);
                }

                const mentorBookings = mentor.bookings ? JSON.parse(mentor.bookings) :[];
                mentorBookings.push(bookingDetails);
                const formatTime = (dateString) => {
                  const date = new Date(dateString);
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');
                  const seconds = String(date.getSeconds()).padStart(2, '0');
                  return `${hours}:${minutes}:${seconds}`;
                };

                const bookingEndTime = booking_time.split(' - ')[1]; // Extract end time from booking_time
                const timeString = formatTime(bookingEndTime);


                const newAvailabilityStart = timeString;

                db.run('UPDATE mentors SET bookings = ?, availability_start = ? WHERE id = ?', [JSON.stringify(mentorBookings),newAvailabilityStart, mentor_id], (err) => {
                  if (err) {
                    return callback(err);
                  }

                  callback(null, { message: 'Booking created successfully', booking_id: bookingId, booking_details: bookingDetails });
                });
              });
            });
          });
        }
      );
    });
  });
};

module.exports = { upsertStudent, insertBooking };
