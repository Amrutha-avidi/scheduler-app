import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { StudentContext } from '../../context/StudentContext';
import './index.css';

const Booking = () => {
  const { mentorId, duration } = useParams();
  const { name, areaOfInterest, availability, student_id } = useContext(StudentContext);
  const [mentorDetails, setMentorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [lastEndTime, setLastEndTime] = useState(null);

  // Fetch mentor details
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

  // Generate slots based on availability and duration
  useEffect(() => {
    const generateSlots = (startTime, endTime, slotDuration, date, lastEndTime) => {
      console.log(lastEndTime)
      const slots = [];
      let currentStart = lastEndTime ? new Date(lastEndTime) : new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);
      console.log(currentStart)

      while (currentStart < end) {
        let slotEnd = new Date(currentStart.getTime() + slotDuration * 60000);
        slots.push({ start: currentStart.toString(), end: slotEnd.toString() });
        currentStart = slotEnd;
      }
      return slots;
    };

    const availabilityDate = new Date(availability).toISOString().split('T')[0];
    const startTime = '19:00:00';
    const endTime = '21:00:00';
    
    const generatedSlots = generateSlots(startTime, endTime, duration, availabilityDate, lastEndTime);
    setSlots(generatedSlots);
  }, [availability, duration, lastEndTime]);

  // Find the next available slot
  const findAvailableSlot = (slots, duration) => {
    for (let i = 0; i < slots.length; i++) {
      const start = new Date(slots[i].start);
      const end = new Date(slots[i].end);

      const slotDuration = (end - start) / 60000;
      if (slotDuration >= duration) {
        setLastEndTime(slots[i].end);
        return slots[i];
      }
    }
    return null;
  };

  // Convert slot to 12-hour format
  const convertTo12HourTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  // Handle booking confirmation
  const handleBooking = async (e) => {
    e.preventDefault();
    const selectedSlot = findAvailableSlot(slots, duration);

    if (selectedSlot) {
      const formattedSlot = {
        start: convertTo12HourTime(selectedSlot.start),
        end: convertTo12HourTime(selectedSlot.end)
      };

      const bookingTime = `${formattedSlot.start} - ${formattedSlot.end}`;
      try {
        await axios.post('/bookings', {
          student_id: student_id,
          mentor_id: mentorId,
          booking_time: bookingTime,
        });
        alert('Booking confirmed!');
      } catch (error) {
        console.error('Error confirming booking:', error);
      }
    } else {
      alert('No available slots found');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!mentorDetails) return <div className="error">Mentor not found</div>;

  const formatDate = (availability) => {
    const date = new Date(availability);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinal = (n) => {
      const j = n % 10, k = n % 100;
      if (j === 1 && k !== 11) return `${n}st`;
      if (j === 2 && k !== 12) return `${n}nd`;
      if (j === 3 && k !== 13) return `${n}rd`;
      return `${n}th`;
    };

    return ` ${month} ${getOrdinal(day)} ${year}`;
  };

  const formattedAvailability = formatDate(availability);
  const formattedExpertise = JSON.parse(mentorDetails.areas_of_expertise);

  return (
    <div className="booking-container">
      <h1>Review Booking</h1>
      <p>
        Dear <strong>{name}</strong>, Please select the slot and confirm your booking on 
        <strong>{formattedAvailability}</strong>
      </p>

      <div className="booking-details">
        <form className="student-info" onSubmit={handleBooking}>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Topic:</strong> {areaOfInterest}</p>
          <p><strong>Selected Duration:</strong> {duration} Minutes</p>
          <button className="confirm-button" type="submit">Confirm Booking</button>
        </form>

        <div className="mentor-info">
          <p><strong>Mentor Name:</strong> {mentorDetails.name}</p>
          <div>
            <p><strong>Expertise:</strong></p>
            <ul>
              {formattedExpertise.map(each => (
                <li key={each}>{each}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
