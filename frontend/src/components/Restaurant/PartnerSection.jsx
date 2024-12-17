import React from "react";

const PartnerSection = () => {
  return (
    <section className="why-partnerR">
      <div className="headerPSR">
        <div className="lineR"></div>
        <div className="partnerHeadR">
          <h2>Why should you partner with Zomato?</h2>
        </div>
        <div className="lineR"></div>
      </div>



      <div className="featuresR">
        <div className="featureR">
          <img src="/images/rest_newCust.png" alt="Attract customers" />
          <h4>Attract new customers</h4>
          <p>Reach the millions of people ordering on Zomato</p>
        </div>
        <div className="featureR">
          <img src="/images/rest_doordel.png" alt="Delivery convenience" />
          <h4>Doorstep delivery convenience</h4>
          <p>Easily get your orders delivered through our trained delivery partners</p>
        </div>
        <div className="featureR">
          <img src="/images/rest_support.png" alt="Hotline support" />
          <h4>Hotline support</h4>
          <p>On- call support for any issues or growth consultations</p>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
