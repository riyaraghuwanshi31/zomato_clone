import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const DashOrder = ({ restaurantEmail }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch previous orders for the restaurant
        const fetchOrders = async () => {
            try {
                const response = await fetch(`https://zomato-clone-xi-five.vercel.app/api/orders?restaurantEmail=${restaurantEmail}`);
                const data = await response.json();
                if (response.ok) {
                    setOrders(data.orders);
                } else {
                    console.error('Failed to fetch orders:', data.message);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();

        // Setup socket connection
        const socket = io('https://zomato-clone-xi-five.vercel.app'); // Replace with your backend URL
        socket.on('newOrder', (order) => {
            if (order.restaurantEmail === restaurantEmail) {
                setOrders((prevOrders) => [order, ...prevOrders]);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [restaurantEmail]);

    const handleUpdateStatus = async (orderId, status) => {
        try {
            const response = await fetch(`https://zomato-clone-xi-five.vercel.app/api/orders/updateStatus/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const updatedOrder = await response.json();

            if (response.ok) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, status: updatedOrder.status } : order
                    )
                );
            } else {
                console.error('Failed to update status:', updatedOrder.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <section className="orders-section">
            <h3>Orders</h3>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="order-item">
                        <p>Order ID: {order._id}</p>
                        <p>Dish: {order.items.map((item) => item.name).join(', ')}</p>
                        <p>Price: Rs.{order.totalAmount}</p>
                        <p>Status: {order.status}</p>
                        {order.status === 'Pending' && (
                            <button onClick={() => handleUpdateStatus(order._id, 'Processed')}>
                                Mark as Processed
                            </button>
                        )}
                        {order.status === 'Processed' && (
                            <button onClick={() => handleUpdateStatus(order._id, 'Delivered')}>
                                Mark as Delivered
                            </button>
                        )}
                    </div>
                ))
            )}
        </section>
    );
};

export default DashOrder;
