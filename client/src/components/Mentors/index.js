import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { StudentContext } from '../../context/StudentContext'; // Import the context
import axios from 'axios';
import './index.css'
import MentorItem from '../MentorItem';


const Mentors = () => {
  const { name, areaOfInterest, availability } = useContext(StudentContext);
  const [mentorData, setMentorData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/mentors'); // Ensure the URL matches your backend
        setMentorData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts

  const filteredMentorData = mentorData.filter(mentor =>
    mentor.areas_of_expertise.includes(areaOfInterest) && mentor.availability === availability
  );

  const formatDate = (availability) => {
    if (!availability) return "";

    const date = new Date(availability);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinal = (n) => {
      const j = n % 10;
      const k = n % 100;
      if (j === 1 && k !== 11) return `${n}st`;
      if (j === 2 && k !== 12) return `${n}nd`;
      if (j === 3 && k !== 13) return `${n}rd`;
      return `${n}th`;
    };

    return ` ${month} ${getOrdinal(day)} ${year}`;
  };

  const formattedAvailability = formatDate(availability);

  return (
    <div>
      {name ?
        (<div className="mentors-container">
          <h1>Hello {name} !!</h1>
          {filteredMentorData.length > 0 ? (
            <div>
              <p className='intro-paras'>These are the mentors available for your chosen area of interest: <strong>{areaOfInterest}</strong> on <strong>{formattedAvailability}</strong></p>
              <ul className='filtered-mentors-con'>
                {filteredMentorData.map((mentor) => (
                  <MentorItem key={mentor.id} mentor={mentor} />
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <p className='intro-paras'>Sorry, no mentors are available on your chosen area of interest: <strong>{areaOfInterest}</strong> on <strong>{formattedAvailability}</strong> </p>
              <p className='intro-paras'>Try exploring other areas or adjust your availability <Link to='/profile' style={{ color: 'brown' }}>Here</Link></p>
            </div>
          )}
        </div>) :
        (
          <div className="mentors-container">
            <h1>Hello User !</h1>
            <p className='intro-paras'>Please Enter your Details <Link to='/profile' style={{ color: 'brown' }}>Here</Link></p>
          </div>
        )}
    </div>
  );
};

export default Mentors;
