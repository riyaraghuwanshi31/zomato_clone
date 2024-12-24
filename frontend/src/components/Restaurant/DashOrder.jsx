import React from 'react'

const DashOrder = () => {
    return (
        <section className="orders-section">
            <h3>Orders</h3>
            <div className="order-list">
                {/* Map through orders */}
                <div className="order-item">
                    <p>Order ID: 123</p>
                    <p>Dish: Pasta</p>
                    <p>Price: $10</p>
                    <p>Status: Delivered</p>
                </div>
            </div>
        </section>

    )
}

export default DashOrder
