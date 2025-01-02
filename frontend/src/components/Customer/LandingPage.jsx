import React, {useState} from 'react';
import Header from './Header';
import InspirationSection from './InspirationSection';
import { useLocation } from 'react-router-dom';
import './LandingPage.css';
import TopBrands from './TopBrands';
import Restro from './Restro';

function LandingPage() {
  const locationLog = useLocation();
  const { user_name, email } = locationLog.state || {};

  console.log(`UserName: ${user_name} and Email: ${email}`);

  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');

  // Function to handle search and update location and query state
  const handleSearch = (location, query) => {
    setLocation(location);
    setQuery(query);
  };

  return (
    <div className="App">
      <Header onSearch={handleSearch} userName={user_name} email={email}/>
      <InspirationSection />
      <TopBrands />
      <Restro location={location} query={query} userName={user_name}  email={email}/>
     
    </div>
  );
}

export default LandingPage;
