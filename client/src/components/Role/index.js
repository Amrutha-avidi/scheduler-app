import React,{useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext';

const Role = () => {
  const { setRole } = useContext(StudentContext);
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'mentor') {
      navigate('/bookings'); // Navigate to bookings for mentors
    } else if (selectedRole === 'student') {
      navigate('/profile'); // Navigate to profile for students
    }
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <button onClick={() => handleRoleSelection('student')}>I am a Student</button>
      <button onClick={() => handleRoleSelection('mentor')}>I am a Mentor</button>
    </div>
  );
};

export default Role;
