import React, { useState } from 'react';
import SearchBar from './SearchBar';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <header className="headerC">
            <div className="headerUC">
                <div className="logoC"><a>Get the App</a></div>
                <div className="hamburgerC" onClick={toggleMenu}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <nav className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
                    {/* <a href="#">Investor Relations</a> */}
                    <a href="/restaurantMainPage">Add Restaurant</a>
                    <a href="/login">Log In</a>
                    <a href="/register">Sign Up</a>
                </nav>
            </div>

            <div className="headerMC">
                <SearchBar />
            </div>
        </header>
    );
}


export default Header;
