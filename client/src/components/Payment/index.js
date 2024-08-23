import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Payment = () => {
  const [students, setStudents] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/students'); // Ensure the URL matches your backend
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 
  console.log(students[0].bookings)

  return (
    <div>Payment</div>
  )
}

export default Payment