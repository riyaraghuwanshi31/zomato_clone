import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Delivered.css";

const Delivered = () => {
    const location = useLocation();
    const { orderDetails, orderId } = location.state || {};

    useEffect(() => {
        // Update order status to "Delivered"
        const updateOrderStatus = async () => {
            try {
                const response = await fetch(`https://zomato-clone-xi-five.vercel.app/api/orders/updateStatus/${orderId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 'Delivered' }),
                });

                if (!response.ok) {
                    console.error('Failed to update order status');
                }
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        };

        if (orderId) {
            updateOrderStatus();
        }
    }, [orderId]);

    return (
        <div className="Delivered-container">
            <h1>Order Delivered Successfully!</h1>
            <h2>Order ID: {orderId}</h2>
            <div>
                <h3>Order Details:</h3>
                {orderDetails?.items?.length > 0 ? (
                    orderDetails.items.map((item, index) => (
                        <p key={index}>{item.name} - Rs. {item.price}</p>
                    ))
                ) : (
                    <p>No items found</p>
                )}
                <p><strong>Total Amount: Rs. {orderDetails?.totalAmount || 0}</strong></p>
            </div>
        </div>
    );
};

export default Delivered;
