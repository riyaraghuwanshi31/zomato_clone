import React from 'react';
import { SocialIcon } from 'react-social-icons';

const Footer = () => (

  <footer className="footerC">
    <div className="footContC">
      <div className='footLogoC'>
        <img src="/images/bnw Logo.png" alt="" />
      </div>
      <div className="footer-linksC">
        <div>
          <h3>ABOUT ZOMATO</h3>
          <a href="#">Who We Are</a>
          <a href="#">Blog</a>
          <a href="#">Work With Us</a>
          <a href="#">Investor Relations</a>
          <a href="#">Report Fraud</a>
          <a href="#">Press Kit</a>
          <a href="#">Contact Us</a>
        </div>
        <div>
          <h3>ZOMAVERSE</h3>
          <a href="#">Zomato</a>
          <a href="#">Blinkit</a>
          <a href="#">District</a>
          <a href="#">Feeding India</a>
          <a href="#">Hyperpure</a>
          <a href="#">Zomato Live</a>
          <a href="#">Zomaland</a>
          <a href="#">Weather Union</a>
        </div>
        <div>
          <h3>FOR RESTAURANTS</h3>
          <a href="#">Partner With Us</a>
          <a href="#">Apps For You</a>
        </div>
        <div>
          <h3>LEARN MORE</h3>
          <a href="#">Privacy</a>
          <a href="#">Security</a>
          <a href="#">Terms</a>
        </div>
        <div className="social-linksC">
          <h3>SOCIAL LINKS</h3>
          <div className="socialC">
            <a><SocialIcon className='iconSC' url="https://linkedin.com" /></a>
            <a><SocialIcon className='iconSC' url="https://instagram.com" /></a>
            <a><SocialIcon className='iconSC' url="https://youtube.com" /></a>
            <a><SocialIcon className='iconSC' url="https://facebook.com" /></a>
            <a><SocialIcon className='iconSC' url="https://twitter.com" /></a>
          </div>


        </div>

      </div>
      <p>
        By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy, and Content Policies. All trademarks are properties of their respective owners. 2008–2024 © Zomato™ Ltd. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
