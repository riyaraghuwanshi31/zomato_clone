import React from 'react';


const CardsSection = () => (
  <div className="cards-sectionC">
    <div className="cardC">

      <a className='cardContC' href="/landing">
        <img src="/images/ordOnline.avif" alt="Order Online" />
        <h3>Order Online</h3>
        <p>Stay home and order to your doorstep</p>
      </a>
    </div>



    <div className="cardC">
      <a href="" className="cardContC">
        <img src="/images/dining.avif" alt="Dining" />
        <h3>Dining</h3>
        <p>View the city's favourite dining venues</p>
      </a>
    </div>



    <div className="cardC">
      <a className='cardContC' href="">
        <img src="/images/liveEvents.jpg" alt="Live Events" />
        <h3>Live Events</h3>
        <p>Discover India's best events & concerts</p>
      </a>
    </div>
  </div>

);

export default CardsSection;
