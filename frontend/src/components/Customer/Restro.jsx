import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Restro = ({ location, query, userName, email }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const navigate = useNavigate();

    console.log(`Restro page username ${userName}`); // debugging

    const fetchAllRestro = async () => {
        try {
            const response = await fetch("https://zomato-clone-xi-five.vercel.app/api/restaurantsData/getRestaurant");
            const data = await response.json();
            setRestaurants(data);
            setFilteredRestaurants(data);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    const filterRestro = () => {
        const filtered = restaurants.filter((restro) => {
            const matchesLocation = location
                ? restro.location?.toLowerCase().includes(location.toLowerCase())
                : true;

            const matchesQuery = query
                ? restro.restaurantName?.toLowerCase().includes(query.toLowerCase()) ||
                  restro.cuisines.some((cuisine) =>
                      cuisine.toLowerCase().includes(query.toLowerCase())
                  ) ||
                  restro.menu?.some((dish) =>
                      dish.name.toLowerCase().includes(query.toLowerCase())
                  )
                : true;

            return matchesLocation && matchesQuery;
        });
        setFilteredRestaurants(filtered);
    };

    const handleRestaurantClick = (restaurantName) => {
        navigate(`/menu/${restaurantName}`, { state: { userName, email } });
    };

    useEffect(() => {
        fetchAllRestro();
    }, []);

    useEffect(() => {
        filterRestro();
    }, [location, query, restaurants]);

    return (
        <section className="restro-section">
            <h2>Food Delivery Restaurants</h2>
            <div className="restroMain">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restro, index) => (
                        <div
                            className="restroRow"
                            key={restro.id || `${restro.restaurantName || 'unknown'}-${index}`}
                            onClick={() => handleRestaurantClick(restro.restaurantName)}
                        >
                            <div className="restroCol">
                                <div className="restroImg">
                                    <img
                                        src={restro.profileImage || "default-image.jpg"}
                                        alt={`${restro.restaurantName} Profile`}
                                    />
                                </div>
                                <div className="restroInfo">
                                    <h4>{restro.restaurantName}</h4>
                                    <div className="detailsRestro">
                                        <p>{restro.cuisines.join(', ') || "Not Available"}</p>
                                        <p>
                                            <span>Delivery Time: </span>
                                            {restro.deliveryTime
                                                ? `${restro.deliveryTime.openTime} am - ${restro.deliveryTime.closeTime} pm `
                                                : "Not Specified"}
                                        </p>
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
