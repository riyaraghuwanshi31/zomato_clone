import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Restro = ({ location, query }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    

    // Fetch all restaurant data from the backend
    const fetchAllRestro = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/restaurantsData/getRestaurant");
            const data = await response.json();
            setRestaurants(data);
            setFilteredRestaurants(data); // Initially, show all restaurants
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    // Filter restaurants based on location and query
    const filterRestro = () => {
        console.log('Location:', location);
        console.log('Query:', query);
        console.log('Restaurants:', restaurants);
        const filtered = restaurants.filter((restro) => {
            const matchesLocation = location
                ? restro.location?.toLowerCase().includes(location.toLowerCase())
                : true;
            const matchesQuery = query
                ? restro.restaurantName?.toLowerCase().includes(query.toLowerCase()) ||
                restro.cuisines.some((cuisine) =>
                    cuisine.toLowerCase().includes(query.toLowerCase())
                )
                : true;

            return matchesLocation && matchesQuery;
        });
        console.log('Filtered:', filtered);
        setFilteredRestaurants(filtered);
    };


    // Fetch data on component mount
    useEffect(() => {
        fetchAllRestro();
    }, []);

    // Filter restaurants when location or query changes
    useEffect(() => {
        filterRestro();
    }, [location, query, restaurants]);

    return (
        <section className="restro-section">
            <h2>Food Delivery Restaurants</h2>
            <div className="restroMain">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restro, index) => (
                        <div className="restroRow" key={restro.id || `${restro.restaurantName || 'unknown'}-${index}`}>
                            <div className="restroCol">
                                <div className="restroImg">
                                    <img src={restro.profileImage || "default-image.jpg"} alt={`${restro.restaurantName} Profile`} />
                                </div>
                                <div className="restroInfo">
                                    <h4>{restro.restaurantName}</h4>
                                    <div className="detailsRestro">
                                        <p><strong>Cuisines:</strong> {restro.cuisines.join(', ') || "Not Available"}</p>
                                        <p><strong>Delivery Time:</strong> {restro.deliveryTime ? `${restro.deliveryTime.openTime} - ${restro.deliveryTime.closeTime}` : "Not Specified"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No restaurants found for the given search criteria.</p>
                )}
            </div>
        </section>
    );
};

export default Restro;
