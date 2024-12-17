import React from "react";
import { TiTick } from "react-icons/ti";

const HeroSection = () => {
    return (
        <div className="heroR">
            <div className="hero-contentR">
                <h1>Partner with Zomato <br /> and grow your business</h1>
                <p>0% commission for the 1st month for new restaurant partners in selected cities</p>
                <button className="register-buttonR"> <a href="/registrationR">Register your restaurant</a> </button>
                <div className="info-cardR">
                    <div>
                        <h3>Get Started - It only takes 10 minutes</h3>
                        <p>Please be ready with the following for a smooth registration</p>
                        <div className="infoContR">
                            <div className="contLR">
                                <ul>
                                    <li> <TiTick /> PAN card</li>
                                    <li> <TiTick /> GST number, if applicable</li>
                                    <li> <TiTick /> Bank account details</li>
                                </ul>
                            </div>
                            <div className="contRR">
                                <ul>
                                    <li> <TiTick /> Menu details and one dish image</li>
                                    <li> <TiTick /> FSSAI license</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="videoR">
                        <video controls autoPlay controlsList="nodownload" src="https://b.zmtcdn.com/data/file_assets/5835a67ef0191da3b505988b3ff9a0141720502359.mp4"></video>
                    </div>

                </div>
            </div>
            <div className="hero-imageR">
                {/* Replace with your image */}
            </div>
        </div>
    );
};

export default HeroSection;
