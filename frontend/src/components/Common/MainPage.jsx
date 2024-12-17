import React from 'react';
import Header from './Header';
import CardsSection from './CardsSection';
import CollectionsSection from './CollectionsSection';
import Footer from './Footer';
import './MainPage.css';

const MainPage = () => (
  <div> 
    <Header />
    <CardsSection />
    {/* <CollectionsSection /> */}
    <Footer />
  </div>  
);

export default MainPage;