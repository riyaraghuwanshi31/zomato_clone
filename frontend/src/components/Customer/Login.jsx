import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate after login
import './Login.css' // Optional: Add CSS styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Sending only email
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Login successful!' });

                // Save the token in localStorage
                localStorage.setItem('token', data.token);

                // Redirect to the main page
                setTimeout(() => {
                    navigate('/landing');
                }, 1000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Login failed' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button className='loginBtn' type="submit">Login</button>
            </form>

            {message && <div className={`message ${message.type}`}>{message.text}</div>}

            <div className="line"></div>

            <p className="create-account-text">
                New to Zomato? <a href="/register">Create Account</a>
            </p>
        </div>
    );
};

export default Login;
