import React, { useContext } from 'react';
import axios from 'axios';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext'; // Import the context


const areasOfInterestOptions = [
  'FMCG Sales',
  'Equity Research',
  'Digital Marketing',
  'Financial Analysis',
  'Operations Management',
  'Human Resources',
  'Consulting',
  'Entrepreneurship',
  'Business Development',
  'Supply Chain Management'
];

const Profile = () => {
  const { name, setName, availability, setAvailability, areaOfInterest, setAreaOfInterest, setStudentId } = useContext(StudentContext); // Consume the context
  const navigate = useNavigate();

 
  const handleSubmit = async (event) => {
    event.preventDefault();

    const studentData = {
      name,
      availability, 
      area_of_interest: areaOfInterest,
    };

    try {
      const response = await axios.post('/students', studentData);
      const student_id = response.data.id;

      // Set the student_id in context
      setStudentId(student_id);

      if (response.error) {
        console.log(response.error);
      } else {
        alert("Registration Successful!!");
        navigate("/mentors");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-container">
      <form className='profile-form' onSubmit={handleSubmit}>
        <h1>Profile</h1>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='date'>Availability:</label>
          <input
            type="date"
            id="date"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="area_of_interest">Area of Interest:</label>
          <select
            id="area_of_interest"
            name="area_of_interest"
            value={areaOfInterest}
            onChange={(e) => setAreaOfInterest(e.target.value)}
            required
          >
            <option value="" disabled>Select your area of interest</option>
            {areasOfInterestOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <button className='submit-button' type="submit"><span>Submit</span></button>
      </form>
    </div>
  );
};

export default Profile;
