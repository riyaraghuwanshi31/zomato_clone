import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Customer/Registration';
import HomePage from './components/Customer/HomePage';
import Login from './components/Customer/Login';
import LandingPage from './components/Customer/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route that redirects to the Register page */}
        <Route path="/" element={<Navigate to="/landing" />} />

        {/* Route for the pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
