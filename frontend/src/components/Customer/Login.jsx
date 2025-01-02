import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://zomato-clone-xi-five.vercel.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Sending only email
            });

            const data = await response.json();

            console.log("Name is " + data.user.name);
            const user_name = data.user.name;

            if (response.ok) {
                setMessage({ type: 'success', text: 'Login successful!' });

                // Save the token in localStorage
                localStorage.setItem('token', data.token);

                // Redirect to the main page
                setTimeout(() => {
                    navigate('/landing', { state: { user_name, email } });
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
        <div className="bgLogin">
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
        </div>

    );
};

export default Login;
