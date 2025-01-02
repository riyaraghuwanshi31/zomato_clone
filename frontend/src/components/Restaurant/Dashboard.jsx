import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./Dashboard.css"
import DashMenu from './DashMenu';
import DashPhotos from './DashPhotos';
import DashOrder from './DashOrder';
import DashProfile from './DashProfile';

const Dashboard = () => {
    const location = useLocation();
    const email = location.state?.email;
    const restroName = location.state?.restroName;
    const [activeSection, setActiveSection] = useState('menu');

    console.log(`Restraurant name: ${restroName}`);

    console.log(`Email is ${email}`);

    return (
        <div className="dashboard">
            {/* Top Navigation Bar */}
            <nav className="top-nav">
                <div className="nav-left">
                    <img src="/images/bnw Logo.png" alt="Zomato Logo" className="zomato-logo" />
                    <p>-Restaurant partner-</p>
                </div>
                <div className="nav-right">


                    <img src="/images/profile.png" alt="Profile" className="profile-logo" />
                    <h4 className="restaurant-name">{restroName}</h4>
                </div>
            </nav>

            {/* Sidebar and Main Content */}
            <div className="dashboard-body">
                {/* Sidebar */}
                <aside className="sidebar">
                    <ul>
                        <li onClick={() => setActiveSection('menu')}>Menu</li>
                        <li onClick={() => setActiveSection('photos')}>Photos</li>
                        <li onClick={() => setActiveSection('orders')}>Orders</li>
                        <li onClick={() => setActiveSection('profile')}>Profile</li>
                    </ul>
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                    {activeSection === 'menu' && <DashMenu email={email} />}
                    {activeSection === 'photos' && <DashPhotos email={email} />}
                    {activeSection === 'orders' && <DashOrder restaurantEmail={email} />}
                    {activeSection === 'profile' && <DashProfile />}
                </main>
            </div>
        </div>
    )
}

export default Dashboard;  