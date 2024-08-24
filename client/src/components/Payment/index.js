import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { StudentContext } from '../../context/StudentContext';

import SessionDetails from '../SessionDetails';
import MentorInfo from '../MentorInfo';
import { formatDate } from '../../utils/formatDate';
import { formatTo12Hour } from '../../utils/formatTo12Hour';
import './index.css';

const Payment = () => {
  const { mentorId, duration } = useParams();
  const { name, areaOfInterest, availability, student_id } = useContext(StudentContext);
  const [mentorDetails, setMentorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([])
  const [lastEndTime, setLastEndTime] = useState(null);
  const [sessionSlot, setSessionSlot] = useState("");

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const response = await axios.get(`/mentors/${mentorId}`);
        setMentorDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mentor details:', error);
        setLoading(false);
      }
    };
    fetchMentorDetails();
  }, [mentorId]);

  useEffect(() => {
    const generateSlots = (startTime, endTime, slotDuration, date, lastEndTime) => {
      const slots = [];
      let currentStart = lastEndTime ? new Date(lastEndTime) : new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);

      while (currentStart < end) {
        let slotEnd = new Date(currentStart.getTime() + slotDuration * 60000);
        if (slotEnd <= end) {
          slots.push({ start: currentStart.toString(), end: slotEnd.toString() });
        }
        currentStart = slotEnd;
      }
      return slots;
    };

    if (mentorDetails) {
      const availabilityDate = new Date(availability).toISOString().split('T')[0];
      const startTime = mentorDetails.availability_start;
      const endTime = mentorDetails.availability_end;

      const generatedSlots = generateSlots(startTime, endTime, duration, availabilityDate, lastEndTime);
      setSlots(generatedSlots)

    }
  }, [availability, duration, lastEndTime, mentorDetails]);

  const findAvailableSlot = (slots, duration) => {
    for (let i = 0; i < slots.length; i++) {
      const start = new Date(slots[i].start);
      const end = new Date(slots[i].end);

      const slotDuration = (end - start) / 60000;
      if (slotDuration >= duration) {
        setLastEndTime(slots[i].end);  // Set last 
        return slots[i];  // Return the first available slot and break the loop
      }
    }
    return null;
  };
  // console.log(sessionSlot)

  const showSlot = ()=>{
    const selectedSlot = findAvailableSlot(slots, duration);
    const bookingTime = `${selectedSlot.start} - ${selectedSlot.end}`;
    setSessionSlot(bookingTime)

  }
  console.log(sessionSlot)
  const handleBooking = async () => {
    if (sessionSlot) {
      // Set the last end time correctly

      try {
        await axios.post('/bookings', {
          student_id: student_id,
          mentor_id: mentorId,
          booking_time: sessionSlot,
          duration
        });
        alert('Booking confirmed!');
      } catch (error) {
        console.error('Error confirming booking:', error);
      }
    } else {
      alert('No available slots found');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!mentorDetails) return <div>Mentor not found</div>;

  const formattedAvailability = formatDate(availability);
  const formatSlot = formatTo12Hour(sessionSlot);

  return (
    <div className="payment-container">
      <h1>Review Booking</h1>
      <p className='welcome-note'>
        Dear <strong>{name}</strong>, Please confirm your booking on
        <strong>{formattedAvailability}</strong>
      </p>
      <div> {sessionSlot === '' ? <button className='slot-button' onClick={showSlot}>Click here to know your booking slot</button> :

        <p className='slot-time'>Your Session Slot: {formatSlot} </p>
      }</div>

      <div className='payment-details'>
        <SessionDetails
        student_id={student_id}
          name={name}
          areaOfInterest={areaOfInterest}
          duration={duration}
          handleBooking={handleBooking}
        />

        <MentorInfo mentorDetails={mentorDetails} />
      </div>
    </div>
  );
};

export default Payment;
