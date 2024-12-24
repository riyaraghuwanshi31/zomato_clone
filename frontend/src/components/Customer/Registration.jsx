import React, { useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Registration.css"; // Import the CSS file for styling

const statesAndCities = {
  MadhyaPradesh: ["Indore", "Bhopal", "Gwalior"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore"],
};

const Registration = () => {
  const form = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState(null);

  const [otp, setOtp] = useState(''); // State to store the OTP
  const [generatedOtp, setGeneratedOtp] = useState(''); // State to store the 
  const [verify, setVerify] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submited = document.getElementById("ans");

    emailjs.sendForm('service_w2jo5o4', 'template_1y9f27q', form.current, 'CXS1RGo2QmIw9tLZk')
      .then((result) => {
        console.log(result.text);
        submited.innerHTML = "Submitted";
      }), (error) => {
        console.log(error.text);
      }

    const formDetail = {
      name,
      email,
      phone,
      address,
      state,
      city,
      pincode,
    }; 
 
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDetail),
      });

      console.log(response.body); // check

      const data = await response.json();

      if (response.ok) {

        // Saving the token to localStorage
        localStorage.setItem("authToken", data.token);

        setMessage({ type: "success", text: "Form submitted successfully!" });

        // Redirect to the home page after successful sign-up
        setTimeout(() => {
          navigate("/homePage");
        }, 2000); // Optional delay to show the success message
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "There was an error submitting the form.",
      });
      console.error("Error in form submission:", error);
    }
  };



  const sendOtp = (e) => {
    e.preventDefault();
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * digits.length)];
    }
    setGeneratedOtp(OTP);

    // Send OTP Email
    emailjs.send('service_w2jo5o4', 'template_1y9f27q', {
      to_name: form.current.to_name.value,
      user_email: form.current.user_email.value,
      otp: OTP
    }, 'CXS1RGo2QmIw9tLZk')
      .then(
        (result) => {
          setVerify(true);
          console.log('Success!', result.text);
        },
        (error) => {
          console.log('Failed..', error.text);
        }
      );
  };

  const verifyOtp = (e) => {
    if (otp === generatedOtp) {
      alert('OTP Verified Successfully!');
    } else {
      alert('Invalid OTP!');
    }
  };


  const handleStateChange = (e) => {
    setState(e.target.value);
    setCity(""); // Reset city when state changes
  };

  return (
    <div className="registration-modal">
      <div className="registration-container">
        <form ref={form} onSubmit={handleSubmit}>
          <h2>Sign up</h2>

          {/* <div id="recaptcha-container"></div> */}

          <input
            type="text"
            placeholder="Full Name"
            name="to_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          {/* Dropdown for State and city  */}

          <div className="state-city-container">
            <select
              value={state}
              onChange={handleStateChange}
              required
            >
              <option value="">Select State</option>
              {Object.keys(statesAndCities).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={!state} // Disable if no state is selected
            >
              <option value="">Select City</option>
              {state &&
                statesAndCities[state].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>

          {/* Input for Pincode */}
          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />

          <div>
            <input
              type="text"
              placeholder="Email"
              name="user_email"
              className="emailOtp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="btnD" onClick={sendOtp}>Verify</button>
          </div>

          {verify ? <div>
            <input
              type="text"
              placeholder="Enter OTP"
              className="emailOtp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)
              }

            />

            <button className='btnD' onClick={verifyOtp}>Submit</button>
          </div> : null
          }


          <div id="ans"></div>


          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              required
            />
            <label>
              I agree to Zomato's{" "}
              <a href="#" className="terms-link">
                Terms of Service
              </a>
              ,{" "}
              <a href="#" className="terms-link">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="terms-link">
                Content Policies
              </a>
              .
            </label>
          </div>

          <button className="create-account-btn" disabled={!isChecked}>
            Create account
          </button>



          <p className="login-text">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}
      </div>
    </div>
  );
};

export default Registration;
