import React from 'react';
import Card from './Card';
import './InspirationSection.css';

function InspirationSection() {
  const items = [
    { id: 1, name: 'Pizza', image: 'pizza_image_url' },
    { id: 2, name: 'Burger', image: 'burger_image_url' },
    { id: 3, name: 'Biryani', image: 'biryani_image_url' },
    { id: 4, name: 'Thali', image: 'thali_image_url' },
    { id: 5, name: 'Chicken', image: 'chicken_image_url' },
    { id: 6, name: 'Rolls', image: 'rolls_image_url' }
  ];

  return (
    <section className="inspiration">
      <h2>Inspiration for your first order</h2>
      <div className="card-container">
        {items.map(item => (
          <Card key={item.id} name={item.name} image={item.image} />
        ))}
      </div>
    </section>
  );
}

export default InspirationSection;
