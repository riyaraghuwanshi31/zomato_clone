import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MenuPage.css';

const MenuPage = () => {
  const { restaurantName } = useParams();
  const location = useLocation();
  const { userName, email } = location.state || {};
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCuisine, setActiveCuisine] = useState(null);
  const [activeTab, setActiveTab] = useState("menu");
  const [cartItems, setCartItems] = useState([]); // Cart state

  // Save restaurant name to localStorage
  useEffect(() => {
    localStorage.setItem('restaurantName', restaurantName);
  }, [restaurantName]);

  const fetchMenuData = async () => {
    try {
      const response = await fetch(
        `https://zomato-clone-xi-five.vercel.app/api/restaurantsData/getMenu?restaurantName=${restaurantName}`
      );
      const data = await response.json();
      setMenuData(data);
      setLoading(false);


      //debugging
      if (data.RestaurantEmail) {
        console.log("Email found with different case.");
      }

      console.log("Restaurant Email (Menu page):", data?.restaurantEmail); // debugging
      

      // Save restro_email to localStorage
      if (data.restaurantEmail) {
        console.log("Saving restaurantEmail:",data.restaurantEmail); // debugging
        localStorage.setItem('restaurantEmail', data.restaurantEmail);
      }

      if (data.cuisines && data.cuisines.length > 0) {
        setActiveCuisine(data.cuisines[0]);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, [restaurantName]);

  if (loading) return <p>Loading...</p>;
  if (!menuData) return <p>Menu not found for this restaurant.</p>;

  const handleCuisineClick = (cuisine) => setActiveCuisine(cuisine);

  const addToCart = (dish) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart, dish];
      localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Save to local storage
      return updatedCart;
    });
  };

  const filteredDishes = menuData.dishes.filter((dish) => dish.cuisine === activeCuisine);

  return (
    <>
      <Header userName={userName} cartCount={cartItems.length} email={email} />
      <section className="menu-page">
        <div className="menu-header">
          <h1>{menuData.restaurantName}</h1>
          <p>
            {Array.isArray(menuData.cuisines)
              ? menuData.cuisines.join(', ')
              : JSON.parse(menuData.cuisines).join(', ')}
          </p>
          <p className="addStyle">
            {menuData.address
              ? `${menuData.address.area || ''}, ${menuData.address.city || ''}, ${menuData.address.landmark || ''}`
              : 'Address not available'}
          </p>
          <div className="timeNnum">
            <div className="deliveryTime">
              <span>Open Hours : </span> {menuData.deliveryTimings.openTime}am -{' '}
              {menuData.deliveryTimings.closeTime}pm
            </div>
            <div className="restroNum">
              <FontAwesomeIcon
                icon="fa-solid fa-phone-volume"
                style={{ color: '#ef4f5f' }}
              />
              +91{menuData.primaryContact}
            </div>
          </div>
        </div>

        <div className="tab-container">
          <div className="tab-bar">
            <button
              className={`tab-button ${activeTab === "menu" ? "active" : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              Menu
            </button>
            <button
              className={`tab-button ${activeTab === "photos" ? "active" : ""}`}
              onClick={() => setActiveTab("photos")}
            >
              Photos
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "photos" && (
              <div className="align_img">
                {menuData.menuImages.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={menuData.restaurantName} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "menu" && (
              <div className="menu-container">
                <div className="cuisine-list">
                  {menuData.cuisines.map((cuisine, index) => (
                    <div
                      key={index}
                      className={`cuisine-item ${activeCuisine === cuisine ? "active" : ""}`}
                      onClick={() => handleCuisineClick(cuisine)}
                    >
                      {cuisine}
                    </div>
                  ))}
                </div>

                <div className="menu-items">
                  {filteredDishes.length > 0 ? (
                    filteredDishes.map((dish, index) => (
                      <div className="menu-item" key={index}>
                        <p>{dish.name}</p>
                        <p>{dish.cuisine}</p>
                        <p>{`Rs. ${dish.price}`}</p>
                        <button onClick={() => addToCart(dish)}>Add to Cart</button>
                      </div>
                    ))
                  ) : (
                    <p>No dishes available for this cuisine.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MenuPage;
