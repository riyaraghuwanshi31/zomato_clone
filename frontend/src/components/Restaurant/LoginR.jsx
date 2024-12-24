import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import './LoginR.css';

const LoginR = () => {
    const form = useRef();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(''); // Entered OTP
    const [generatedOtp, setGeneratedOtp] = useState(''); // System-generated OTP
    const [verify, setVerify] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const [restroName, setRestroName] = useState("");

    const sendOtp = async (e) => {
        e.preventDefault();

        try {

            // Verify entered email from backend
            const response = await fetch('http://localhost:5000/api/restaurants/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            console.log(data.restaurant.restaurantName);
            const restro = data.restaurant.restaurantName;
            setRestroName(restro);


            if (response.ok) {



                // Save the JWT token
                localStorage.setItem('token', data.token);

                console.log("Your token is " + data.token);


                // Generate 4-digit OTP
                const OTP = Math.floor(1000 + Math.random() * 9000).toString();
                setGeneratedOtp(OTP);

                // Send OTP via Email
                emailjs
                    .send(
                        'service_w2jo5o4',
                        'template_1y9f27q',
                        { user_email: email, otp: OTP },
                        'CXS1RGo2QmIw9tLZk'
                    )
                    .then(
                        (result) => {
                            setMessage({ type: 'success', text: 'OTP sent successfully!' });
                            setVerify(true);
                        },
                        (error) => {
                            console.error('EmailJS Error:', error.text);
                            setMessage({ type: 'error', text: 'Failed to send OTP. Please try again.' });
                        }
                    );



            } else {
                setMessage({ type: 'error', text: data.message || 'Login failed.' });
            }
        } catch (error) {
            console.error('Login Error:', error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        }


    };

    const verifyOtp = async (e) => {
        e.preventDefault();

        if (otp === generatedOtp) {
            // Redirect to the main page
            setMessage({ type: 'success', text: 'Login successful!' });
            console.log(email);
        
            setTimeout(() => navigate('/dashboard', { state: { email , restroName} }), 1000);

        } else {
            setMessage({ type: 'error', text: 'Invalid OTP. Please try again.' });
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form ref={form}>
                <input
                    type="email"
                    placeholder="Email"
                    name="user_email"
                    className="emailOtp"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="loginBtn" onClick={sendOtp}>
                    Get OTP
                </button>

                {verify && (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="emailOtp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <button className="btnD" onClick={verifyOtp}>
                            Submit
                        </button>
                    </div>
                )}

                {message && <div className={`message ${message.type}`}>{message.text}</div>}
            </form>

            <div className="line"></div>

            <p className="create-account-text">
                New to Zomato? <a href="/registrationR">Create Account</a>
            </p>
        </div>
    );
};

export default LoginR;
