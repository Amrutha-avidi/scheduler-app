// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Mentors from './components/Mentors';
import Booking from './components/Booking';
import Payment from './components/Payment';
import Navbar from './components/Navbar';
import { StudentProvider } from './context/StudentContext'

import axios from 'axios';
import { baseURL } from './Url';

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
            <Route path="/profile" element={<Profile />} />

            <Route path="/mentors" element={<Mentors />} />
            <Route path="/bookings/:mentorId/:duration" element={<Booking />} />
            
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>
      </Router>
    </StudentProvider>
  );
};

export default App;
