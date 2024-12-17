import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Customer/Registration';
import HomePage from './components/Customer/HomePage';
import Login from './components/Customer/Login';
import LandingPage from './components/Customer/LandingPage';
import MainPage from './components/Common/MainPage';
import RestPage from './components/Restaurant/RestPage';
import RegistrationR from './components/Restaurant/RegistrationR';
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route that redirects to the Register page */}
        <Route path="/" element={<Navigate to="/MainPage" />} />

        {/* Route for the pages */}
        <Route path='/mainPage' element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path='/restaurantMainPage' element={<RestPage />} />
        <Route path='/registrationR' element={<RegistrationR />} />
      </Routes>
    </Router>
  );
};

export default App;
