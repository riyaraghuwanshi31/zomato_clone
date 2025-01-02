import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./OrderStatus.css";

const OrderStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { orderDetails = {}, orderId = "Unknown" } = location.state || {};
    const [orderStatus, setOrderStatus] = useState('Preparing');
    const [statusUpdates, setStatusUpdates] = useState([]);
    const [restaurantDetails, setRestaurantDetails] = useState({});

    useEffect(() => {
        if (!location.state) {
            navigate('/error'); // Redirect to an error page if state is missing
            return;
        }

        try {
            console.log("Status started!"); // debugging
            const statusFlow = [
                { status: 'Preparing', time: '5 mins' },
                { status: 'Delivery boy is arriving to pick up the order', time: '10 mins' },
                { status: 'On the way', time: '20 mins' },
                { status: 'Order Reached', time: 'Completed' },
            ];

            console.log("Status completed!"); // debugging

            let i = 0;
            const interval = setInterval(() => {
                if (i < statusFlow.length && statusFlow[i]) {
                    setOrderStatus(statusFlow[i].status);
                    setStatusUpdates((prev) => [...prev, statusFlow[i]]);
                    i++;
                } else {
                    clearInterval(interval);
                    navigate('/delivered', { state: { orderDetails, orderId } });
                }
            }, 10000);

            console.log("Loop completed!"); // debugging

            const restaurantName = localStorage.getItem('restaurantName') || "Loading...";
            setRestaurantDetails({ name: restaurantName });

            return () => clearInterval(interval);
        } catch (error) {
            console.error("Error in OrderStatus:", error);
        }
    }, []);

    if (!orderDetails?.items) {
        return <div>Invalid order details. Please check and try again.</div>;
    }

    return (
        <div className="OrderStatus-container">
            <h1>Track Your Order</h1>
            <div>
                <h2>Restaurant: {restaurantDetails.name}</h2>
            </div>
            <div>
                <h3>Order ID: {orderId}</h3>
                <h4>Status: {orderStatus || "Loading..."}</h4>
            </div>
            <div className="OrderStatus-orderDetails">
                <h3>Order Details:</h3>
                {orderDetails.items.map((item, index) => (
                    <p key={index}>{item.name} - Rs. {item.price}</p>
                ))}
                <p><strong>Total Amount: Rs. {orderDetails.totalAmount || 0}</strong></p>
            </div>
            <div className="OrderStatus-status">
                <h3>Order Status Updates:</h3>
                {statusUpdates.filter(update => update).length > 0 ? (
                    statusUpdates
                        .filter(update => update)
                        .map((update, index) => (
                            <div key={index}>
                                <p>{update.status}</p>
                            </div>
                        ))
                ) : (
                    <p>No status updates available yet.</p>
                )}
            </div>
        </div>
    );
};

export default OrderStatus;