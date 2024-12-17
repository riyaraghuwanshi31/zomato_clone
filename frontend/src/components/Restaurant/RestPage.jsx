import React from "react";
import Header from "./Header";
import Footer from '../Common/Footer'

import PartnerSection from "./PartnerSection";
import "./RestPage.css";

const RestPage = () => {
    return (
        <div className="restpageR">
            <Header />
            <PartnerSection />
            <Footer/>
        </div>
    );
};

export default RestPage;
