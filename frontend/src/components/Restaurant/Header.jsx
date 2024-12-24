import React from "react";
import HeroSection from "./HeroSection";

const Header = () => {
  return (
    <header className="headerR">
      <div className="headContR">
        <div className="logoR"><img src="/images/wLogo.png" alt="" /> <p>-restaurant partner-</p> </div>
        <div className="restHL">
          <div className="contactR">
            Need help? Call <span>+91 97-38-38-38-38</span>
          </div>
          <button className="login-buttonR"><a href="/loginR">Login</a></button>
        </div>

      </div>


      <div className="heroSectR">
        <HeroSection />
      </div>
    </header>
  );
};

export default Header;
