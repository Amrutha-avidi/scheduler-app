// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Mentors from './components/Mentors';
import MentorBookings from './components/MentorBookings';
import Payment from './components/Payment';
import Navbar from './components/Navbar';
import Role from './components/Role';

import { StudentProvider } from './context/StudentContext'

import axios from 'axios';
import { baseURL } from './Url';
import StudentBookings from './components/StudentBookings';

axios.defaults.baseURL = `${baseURL}`;
axios.defaults.withCredentials = true;

const App = () => {
 
 
  return (
    <StudentProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/role" element={<Role />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/mentors" element={<Mentors />} />
            <Route path="/payment/:mentorId/:duration" element={<Payment />} />
            
            <Route path="/mentor/bookings/:id" element={<MentorBookings />} />
            <Route path="/bookings/student/:id" element={<StudentBookings />} />

          </Routes>
        </div>
      </Router>
    </StudentProvider>
  );
};

export default App;