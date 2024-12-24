import React, { useState } from "react";

function Header({ onSearch }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [location, setLocation] = useState("");
    const [query, setQuery] = useState("");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = () => {
        // Pass the location and query to the parent component
        onSearch(location, query);
    };

    return (
        <header className="header">
            <div className="logo">
                <img src="../public/images/bnw Logo.png" alt="Zomato" />
            </div>
            <div className="search-bar">
                <div className="location-search">
                    {/* <span className="location-icon">📍</span> */}
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="📍Enter location"
                    />
                </div>
                <span className="divider">|</span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for restaurant, cuisine, or a dish"
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className={`auth-links ${isMenuOpen ? "show" : ""}`}>
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