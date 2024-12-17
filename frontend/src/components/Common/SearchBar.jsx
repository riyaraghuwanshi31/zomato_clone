import React from 'react';


const SearchBar = () => (
  <div className="search-barC">
    <div className="logoImgC">
        <img src="/images/wLogo.png" alt="" />
    </div>
    <h2>Discover the best food & drinks in Indore</h2>
    <div className="searchC">
      <input type="text" placeholder="Search for restaurant, cuisine, or a dish" />
    </div>
  </div>
);

export default SearchBar;
