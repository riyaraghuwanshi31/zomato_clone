import React, { useState } from 'react';


function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="logo">
                <img src="../public/images/bnw Logo.png" alt="Zomato" />
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Search for restaurant, cuisine, or a dish" />
                <button>Search</button>
            </div>
            <div className={`auth-links ${isMenuOpen ? 'show' : ''}`}>
                <a href="/login">Log in</a>
                <a href="/register">Sign up</a>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </header>
    );
}

export default Header;
