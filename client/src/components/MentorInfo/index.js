// components/MentorInfo.js
import React from 'react';
import './index.css'

const MentorInfo = ({ mentorDetails }) => {
  const formattedExpertise = JSON.parse(mentorDetails.areas_of_expertise);

  return (
    <div className="mentor-info">
      <p><strong>Mentor Name:</strong> {mentorDetails.name}</p>
      <div className='mentor-info-content'>
        <p><strong>Expertise:</strong></p>
        <ul>
          {formattedExpertise.map(each => (
            <li key={each}>{each}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MentorInfo;
