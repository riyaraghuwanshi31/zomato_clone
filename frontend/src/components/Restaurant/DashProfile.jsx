import React, { useEffect, useState } from "react";
import axios from "axios";

const DashProfile = () => {
    const [profile, setProfile] = useState({
        email: "",
        primaryContact: "",
        ownerName: "",
        restaurantName: "",
    });

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token'); // Or wherever you store the token
            const response = await axios.get('http://localhost:5000/api/restaurants/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Profile fetched:', response.data);


            setProfile({
                email: response.data.email || "",
                primaryContact: response.data.primaryContact || "",
                ownerName: response.data.ownerName || "",
                restaurantName: response.data.restaurantName || "",
            });

        } catch (error) {
            console.error('Error fetching profile:', error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            console.log(token);

            console.log(profile); //debug

            const response = await axios.put("http://localhost:5000/api/restaurants/profile", profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.message) {
                alert(`Success: ${response.data.message}`);
            } else {
                alert("Profile updated successfully!"); // Fallback message
            }


        } catch (error) {
            console.error("Error updating Profile:", error);
            if (error.response) {
                console.error("Response error:", error.response.data);
                alert(`Failed to update Profile: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
                console.error("Request error:", error.request);
                alert("Failed to update Profile: No response from the server. Please try again later.");
            } else {
                console.error("Unexpected error:", error.message);
                alert(`Failed to update Profile: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <section className="settings-section">
            <h3>Profile</h3>
            <form onSubmit={handleSaveChanges}>
                <input
                    type="text"
                    name="email"
                    value={profile.email}
                    placeholder="Email"
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="primaryContact"
                    value={profile.primaryContact}
                    placeholder="Phone Number"
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="ownerName"
                    value={profile.ownerName}
                    placeholder="Owner Name"
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="restaurantName"
                    value={profile.restaurantName}
                    placeholder="Restaurant Name"
                    onChange={handleInputChange}
                />
                {/* <textarea
                    name="address"
                    value={profile.address}
                    placeholder="Address"
                    onChange={handleInputChange} 
                ></textarea> */}
                <button type="submit">Save Changes</button>
            </form>
        </section>
    );
};

export default DashProfile;