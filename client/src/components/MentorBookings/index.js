import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { formatTo12Hour } from '../../utils/formatTo12Hour';
import {formatDate} from '../../utils/formatDate'
import './index.css'

const MentorBookings = () => {
  const { id } = useParams()
  console.log(id)
  const [mentorData, setMentorData] = useState({})

  useEffect(() => {
    const getMentorData = async () => {
      try {
        const response = await axios.get(`/bookings/mentor/${id}`)
        setMentorData(response.data)
      }
      catch (err) {
        console.error('Error fetching mentor details:', err);

      }
    }
    getMentorData()


  }, [id])
  console.log(mentorData.bookings)

  const {name, bookings,availability } = mentorData
  const formattedBookings = bookings ? JSON.parse(bookings) : [];


  return (
    <div className="mentor-bookings-container">
      <h2 className="heading">Bookings for {name} on {formatDate(availability)}</h2>
      {formattedBookings.length > 0 ? (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Booking Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {formattedBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.student_name}</td>
                <td>{formatTo12Hour(booking.booking_time)}</td>
                <td>{booking.duration} mins</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings available for this mentor.</p>
      )}
    </div>
  )
}

export default MentorBookings