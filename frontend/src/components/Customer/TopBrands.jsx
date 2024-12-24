import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import './InspirationSection.css';

function TopBrands() {
  const items = [
    { id: 1, name: 'Apna Sweets', image: '../public/images/poha.avif' },
    { id: 2, name: `Domino's`, image: '../public/images/samosa.avif' },
    { id: 3, name: 'McDonalds', image: '../public/images/kachori.avif' },
    { id: 4, name: 'Nafees Restaurant', image: '../public/images/jalebi.avif' },
    { id: 5, name: 'Burger King', image: '../public/images/sweets.avif' },
    { id: 6, name: `Tinku's`, image: '../public/images/sandwixh.avif' },
  
    { id: 5, name: 'KFC', image: '../public/images/idli.avif' },
    { id: 5, name: 'Pizza Hut', image: '../public/images/tea.avif' },
    // { id: 5, name: 'Aloo Kachori', image: '../public/images/kachori.avif' },
    // { id: 5, name: 'Khaman', image: '../public/images/sandwixh.avif' },
    // { id: 5, name: 'Vada', image: '../public/images/vada.avif' },
  ];

  return (
    <section className="inspiration">
      <div className="inspCont">
        <h2>Top brands for you </h2>

        <Swiper
          spaceBetween={10}
          slidesPerView={6}
          navigation={true} // Enable navigation
          modules={[Navigation]} // Include Navigation module
          breakpoints={{
            // Adjust the number of slides based on screen width
            320: { slidesPerView: 1 }, // For small screens, show 1 slide
            480: { slidesPerView: 2 }, // For slightly larger screens, show 2 slides
            640: { slidesPerView: 3 }, // For moderate small screens, show 3 slides
            768: { slidesPerView: 4 }, // For medium screens, show 4 slides
            1024: { slidesPerView: 5 }, // For desktops, show 5 slides
            1280: { slidesPerView: 6 }, // For larger screens, show 6 slides
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="card">
                <div className="imgCont">
                  <img src={item.image} alt={item.name} />
                </div>

                <h3>{item.name}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
}

export default TopBrands;
