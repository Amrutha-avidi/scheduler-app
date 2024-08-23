import React, { createContext, useState } from 'react';

// Create the context
export const StudentContext = createContext();

// Create a provider component
export const StudentProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [availability, setAvailability] = useState('');
  const [areaOfInterest, setAreaOfInterest] = useState('');
  const [student_id, setStudentId] = useState(null); // Add student_id


  return (
    <StudentContext.Provider
      value={{ name, setName, availability, setAvailability, areaOfInterest, setAreaOfInterest,student_id, setStudentId }}
    >
      {children}
    </StudentContext.Provider>
  );
};
