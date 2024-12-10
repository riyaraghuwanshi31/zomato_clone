import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="../public/images/bnw Logo.png" alt="Zomato" />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search for restaurant, cuisine or a dish" />
        <button>Search</button>
      </div>
      <div className="auth-links">
        <a href="/login">Log in</a>
        <a href="/register">Sign up</a>
      </div>
    </header>
  );
}

export default Header;
