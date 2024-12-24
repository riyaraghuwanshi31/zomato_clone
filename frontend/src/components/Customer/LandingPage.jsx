import React, {useState} from 'react';
import Header from './Header';
import InspirationSection from './InspirationSection';
import './LandingPage.css';
import TopBrands from './TopBrands';
import Restro from './Restro';

function LandingPage() {

  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');

  // Function to handle search and update location and query state
  const handleSearch = (location, query) => {
    setLocation(location);
    setQuery(query);
  };

  return (
    <div className="App">
      <Header onSearch={handleSearch} />
      <InspirationSection />
      <TopBrands />
      <Restro location={location} query={query} />
    </div>
  );
}

export default LandingPage;
