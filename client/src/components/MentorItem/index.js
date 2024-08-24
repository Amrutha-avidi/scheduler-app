import React, {  useState } from 'react'
import { Link } from 'react-router-dom'
import './index.css'

const MentorItem = (data) => {
    const { mentor } = data
    const [selectedDuration, setSelectedDuration] = useState('30');

    function convertTo12HourFormat(time24) {
        // Split the time into hours and minutes
        let [hours, minutes] = time24.split(':').map(Number);
    
        // Determine AM or PM suffix
        const period = hours >= 12 ? 'PM' : 'AM';
    
        // Convert hours from 24-hour format to 12-hour format
        hours = hours % 12 || 12; // Convert 0 to 12 and 13-23 to 1-11
    
        // Format hours and minutes
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
        // Return formatted time
        return `${formattedHours}:${formattedMinutes} ${period}`;
    }

    const start = convertTo12HourFormat(mentor.availability_start)
    const end = convertTo12HourFormat(mentor.availability_end)

    return (
        <li className='filtered-mentors-items' key={mentor.id}>
            <h3>{mentor.name} , {mentor.id}</h3>
            <div className='mentor-content'>
                <div className='mentor-areas'>Expertise:
                    <ul>{mentor.areas_of_expertise.map(each => (
                        <li className="badge" key={each}>{each}</li>
                    ))}
                    </ul>
                </div>
                <div className="mentor-availability">
                    Availability : <p> {start} - {end}</p>

                </div>
                <div className='mentor-duration'>
                    <label htmlFor='duration'> Duration :</label>
                    <select name="duration" id="duration" value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}>
                        <option value='30'>30 Minutes</option>
                        <option value='45'>45 Minutes</option>
                        <option value='60'>60 Minutes</option>
                    </select>
                </div>
            </div>
            <div className='mentor-footer '>
                <Link to={`/payment/${mentor.id}/${selectedDuration}`} className="book-button">Book Now</Link>

            </div>
        </li>
    )
}

export default MentorItem