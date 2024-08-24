// components/SessionDetails.js
import React from 'react';
import './index.css'
import { useNavigate } from 'react-router-dom';

const SessionDetails = ({student_id ,name, areaOfInterest, duration, handleBooking }) => {
  let sessionCost
  const navigate = useNavigate()

  if (duration === '30') {
    sessionCost = 2000

  }
  else if (duration === '45') {
    sessionCost = 3000
  }
  else {
    sessionCost = 4000
  }

  const onConfirm = (e) => {
    e.preventDefault()
    handleBooking()
    alert("booking confired !!")
    navigate(`/bookings/student/${student_id}`)
  }

  return (

        <form className="student-info" onSubmit={onConfirm}>
          <p><strong>Student Name:</strong> {name}</p>
          <p><strong>Topic:</strong> {areaOfInterest}</p>
          <p><strong>Selected Duration:</strong> {duration} Minutes</p>
          <p>Your booking requires a payment of <strong>₹{sessionCost}</strong></p>
          <button className="confirm-button" >
            Pay ₹{sessionCost} and Confirm Booking
          </button>
        </form>
  );
}

export default SessionDetails;
