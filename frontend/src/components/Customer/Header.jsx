import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import "./Header.css";

function Header({ onSearch, userName, cartCount, email }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [location, setLocation] = useState("");
    const [query, setQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const handleSearch = () => {
        if (!location && !query) {
            alert("Please enter a location or a query to search.");
            return;
        }
        onSearch(location.trim(), query.trim());
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handleNavigateToCart = () => {
        navigate("/cartPage", {
            state: { userName, email },
        });
    };

    return (
        <header className="header">
            <div className="logo">
                <img src="../public/images/bnw Logo.png" alt="Zomato" />
            </div>
            <div className="search-bar">
                <div className="location-search">
                    <input
                        className="location-input"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="📍 Location"
                    />
                </div>
                <span className="divider">|</span>
                <input
                    className="restro-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for restaurant"
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="auth-section">
                {userName ? (
                    <>
                        <div className="cart-section">
                            <button onClick={handleNavigateToCart}>
                                <a href="/cartPage" className="cart-link">
                                    <FaShoppingCart />
                                    <span className="cart-span">Cart {cartCount}</span>
                                </a>
                            </button>
                        </div>
                        <div className="user-dropdown">
                            <div className="user-info" onClick={toggleDropdown}>
                                <div className="user-avatar">
                                    <span>{userName.charAt(0)}</span>
                                </div>
                                <span className="user-name">{userName}</span>
                                <span className="dropdown-arrow">
                                    <IoIosArrowDown />
                                </span>
                            </div>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <a href="/profile">Profile</a>
                                    <a href="/reviews">Reviews</a>
                                    <a href="/settings">Settings</a>
                                    <button onClick={handleLogout}>Log out</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={`auth-links ${isMenuOpen ? "show" : ""}`}>
                        <a href="/login">Log in</a>
                        <a href="/register">Sign up</a>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
