import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../StudentForm';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import './index.css'

const Profile = () => {
  const [mentorName, setMentorName] = useState('');
  const [mentorId, setMentorId] = useState(null);
  const { role } = useContext(StudentContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentorId = async () => {
      if (mentorName) {
        try {
          const response = await axios.get('/mentors');
          const mentorObject = response.data.find(each => each.name === mentorName);
          if (mentorObject) {
            setMentorId(mentorObject.id);
          } else {
            setMentorId(null); // Clear mentorId if not found
          }
        } catch (error) {
          console.error("Error fetching mentor data:", error);
        }
      }
    };

    fetchMentorId();
  }, [mentorName]);

  const handleFindBookings = () => {
    if (mentorId) {
      navigate(`/mentor/bookings/${mentorId}`);
    } else {
      alert('Mentor not found');
    }
  };

  const MentorForm = () => (
    <div className='mentor-con'>
      <h1>Mentor Profile</h1>
      <div>
        <label htmlFor='mentor'>Name:</label>
        <input
          type="text"
          id='mentor'
          value={mentorName}
          onChange={(e) => setMentorName(e.target.value)}
          required />
      </div>
      <button className='submit-button' onClick={handleFindBookings}><span>Your Bookings</span></button>

    </div>
  );

  return (
    <div className="profile-container">
      {role === 'student' ? (<StudentForm />) : (<MentorForm />)}
    </div>
  );
};

export default Profile;
