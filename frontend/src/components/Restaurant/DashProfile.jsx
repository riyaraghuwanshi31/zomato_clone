import React, { useEffect, useState } from "react";
import axios from "axios";

const DashProfile = () => {
  const [profile, setProfile] = useState({
    email: "",
    primaryContact: "",
    ownerName: "",
    restaurantName: "",
    cuisines: [],
  });

  const allCuisines = [
    "Chinese",
    "Fastfood",
    "North Indian",
    "South Indian",
    "Biryani",
    "Pizza",
    "Sweets",
    "Cakes",
  ];

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://zomato-clone-xi-five.vercel.app/api/restaurants/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile fetched:", response.data);

      setProfile({
        email: response.data.email || "",
        primaryContact: response.data.primaryContact || "",
        ownerName: response.data.ownerName || "",
        restaurantName: response.data.restaurantName || "",
        cuisines: response.data.cuisines || [],
      });
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const toggleCuisineSelection = (cuisine) => {
    setProfile((prevSettings) => {
      const updatedCuisines = prevSettings.cuisines.includes(cuisine)
        ? prevSettings.cuisines.filter((c) => c !== cuisine) // Deselect cuisine
        : [...prevSettings.cuisines, cuisine]; // Select cuisine
      return {
        ...prevSettings,
        cuisines: updatedCuisines,
      };
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      console.log(profile); // Debug

      const response = await axios.put(
        "https://zomato-clone-xi-five.vercel.app/api/restaurants/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.message) {
        console.log("Profile cuisines: ", response.data.cuisines);
        alert(`Success: ${response.data.message}`);
      } else {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating Profile:", error);
      if (error.response) {
        alert(
          `Failed to update Profile: ${error.response.data.message || "Server error"}`
        );
      } else if (error.request) {
        alert("Failed to update Profile: No response from the server.");
      } else {
        alert(`Failed to update Profile: ${error.message}`);
      }
    }
  };

  console.log("Cuisines: " +profile.cuisines);

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

        <div className="cuisines-container">
          <h4>Select Cuisines</h4>
          <div className="cuisine-list">
            {allCuisines.map((cuisine) => (
              <div
                key={cuisine}
                className={`cuisine-item ${
                  profile.cuisines.includes(cuisine) ? "selected" : "unselected"
                }`}
                onClick={() => toggleCuisineSelection(cuisine)}
              >
                {cuisine}
              </div>
            ))}
          </div>
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </section>
  );
};

export default DashProfile;
