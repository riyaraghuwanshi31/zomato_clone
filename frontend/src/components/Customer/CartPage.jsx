import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LuCircleArrowRight } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import "./CartPage.css";

const CartPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { userName, email } = location.state || {};
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantEmail, setRestaurantEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [cartItems, setCartItems] = useState([]); // Assuming cartItems are stored in state
    const deliveryCharge = 30;

    console.log(`Email in cart ${email}`);
    console.log(`User name is ${userName}`);

    useEffect(() => {

        // Retrieve restaurant name and email from local storage
        const savedRestaurantName = localStorage.getItem('restaurantName');
        const savedRestaurantEmail = localStorage.getItem('restaurantEmail');
        if (savedRestaurantName) setRestaurantName(savedRestaurantName);
        if (savedRestaurantEmail) {
            console.log("Retrieved restaurantEmail from localStorage:", savedRestaurantEmail);
            setRestaurantEmail(savedRestaurantEmail);
        }

        console.log("Restro Email:" +restaurantEmail);

        // Retrieve cart items from local storage
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) setCartItems(JSON.parse(storedCart));


        // Fetch user details using email
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://zomato-clone-xi-five.vercel.app/api/restaurantsData/userData?email=${email}`);

                const data = await response.json();

                setUserDetails(data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, [email]);

    const handleRemoveItem = (index) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.filter((_, i) => i !== index);
            localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Update local storage
            return updatedCart;
        });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveDetails = () => {
        setIsEditing(false);
    };

    const totalAmount =
        cartItems.reduce((total, item) => total + Number(item.price), 0) + deliveryCharge;



    const handlePlaceOrder = async () => {
        const orderDetails = {
            restaurantName,
            restaurantEmail,
            userEmail: email,
            userName: userDetails.name,
            items: cartItems,
            totalAmount,
            status: 'Pending', 
        };

        try {
            console.log(`Before Fetching. Restro Email: ${orderDetails.restaurantEmail}, Restro Name: ${orderDetails.restaurantName}, Email : ${orderDetails.userEmail}, Name: ${orderDetails.userName}, Items: ${orderDetails.items}, Total Amount: ${orderDetails.totalAmount}`); // debugging

            const response = await fetch('https://zomato-clone-xi-five.vercel.app/api/orders/placeOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails),
            });


            const result = await response.json();

            if (response.ok) {
                alert(`Order placed successfully! Your order ID is ${result.orderId}`);
                // setCartItems([]);
                // localStorage.removeItem('cartItems'); // Clear local storage

                navigate('/order-status', { state: { orderDetails, orderId: result.orderId } });

            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred. Please try again.');
        }
    };



    if (!userDetails) {
        return <p>Loading...</p>;
    }

    console.log("Data: " + userDetails.email);

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>

            {cartItems.length > 0 ? (
                <>
                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div>
                                    <p>{item.name}</p>
                                    <p>Rs. {item.price}</p>
                                </div>
                                <button onClick={() => handleRemoveItem(index)}>Remove</button>
                            </div>
                        ))}
                    </div>

                    <div className="user-details">
                        <h2>Your Details</h2>
                        {isEditing ? (
                            <div className="edit-details">

                                <input
                                    type="text"
                                    value={userDetails.name}
                                    onChange={(e) =>
                                        setUserDetails({ ...userDetails, name: e.target.value })
                                    }
                                    placeholder="Name"
                                />
                                <input
                                    type="text"
                                    value={userDetails.phone}
                                    onChange={(e) =>
                                        setUserDetails({ ...userDetails, phone: e.target.value })
                                    }
                                    placeholder="Contact"
                                />
                                <input
                                    type="text"
                                    value={userDetails.address}
                                    onChange={(e) =>
                                        setUserDetails({ ...userDetails, address: e.target.value })
                                    }
                                    placeholder="Address"
                                />
                                <button onClick={handleSaveDetails}>Save</button>
                            </div>
                        ) : (
                            <div className="display-details">
                                <div className="userDetails">
                                    <p>
                                        <strong>Name:</strong> {userDetails.name}
                                    </p>
                                    <p>
                                        <strong>Contact:</strong> {userDetails.phone}
                                    </p>
                                    <p>
                                        <strong>Address:</strong> {userDetails.address}, {userDetails.city}, {userDetails.state} - {userDetails.pincode}
                                    </p>
                                </div>

                                <div className="detailsButton">
                                    <button onClick={handleEditToggle}><LuCircleArrowRight /></button>
                                </div>

                            </div>
                        )}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <p>
                            Subtotal: Rs.{" "}
                            {cartItems.reduce((total, item) => total + Number(item.price), 0)}
                        </p>
                        <p>Delivery Charge: Rs. {deliveryCharge}</p>
                        <p>
                            <strong>Total: Rs. {totalAmount}</strong>
                        </p>
                        <button className="place-order-button" onClick={handlePlaceOrder}>
                            Place Order
                        </button>
                    </div>

                </>
            ) : (
                <p>Your cart is empty. Add some items to proceed.</p>
            )}
        </div>
    );
};

export default CartPage;
