import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationR.css';

const RegistrationR = () => {

    const [activeStep, setActiveStep] = useState('restaurantInfo');
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        restaurantName: '',
        ownerName: '',
        email: '',
        ownerMobile: '',
        primaryContact: '',
        address: {
            shopNumber: '',
            floor: '',
            area: '',
            city: '',
            landmark: '',
        },
        cuisines: [],
        deliveryTimings: {
            openTime: '',
            closeTime: '',
        },
        profileImage: null,
        menuImages: [],
        panCard: null,
        fssaiLicense: null,
        bankDetails: '',
        gstNumber: '',
    });


    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevState) => {
            const updatedFormData = {
                ...prevState,
                [name]: name === "menuImages" ? Array.from(files) : files[0],
            };
            console.log("Updated FormData:", updatedFormData);
            return updatedFormData;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const cuisines = ["Chinese", "Fast Food", "North Indian", "South Indian", "Biryani", "Pizza"];

    const handleCuisineClick = (cuisine) => {
        const updatedCuisines = selectedCuisines.includes(cuisine)
            ? selectedCuisines.filter((item) => item !== cuisine)
            : [...selectedCuisines, cuisine];

        if (updatedCuisines.length > 3) {
            alert("You can select up to 3 cuisines only.");
            return;
        }

        setSelectedCuisines(updatedCuisines);
        setFormData({ ...formData, cuisines: updatedCuisines });
    };


    const handleSubmit = async (e) => {
       

        try {
            let endpoint = '';
            const headers = {};

            console.log("In the starting"); // debugging

            let dataToSend = { ...formData };

            console.log(`data to send ${dataToSend}`); //debugging

            if (activeStep === 'restaurantInfo') {
                endpoint = 'http://localhost:5000/api/restaurants/info';
                headers['Content-Type'] = 'application/json';
            } else if (activeStep === 'menuDetails') {

                console.log(formData); // debugging
                console.log("Before url"); // debugging

                endpoint = 'http://localhost:5000/api/restaurants/menu';

                console.log("After url "); // debugging

                const formDataWithFiles = new FormData();

                formDataWithFiles.append('email', formData.email); // connect 

                formDataWithFiles.append('profileImage', formData.profileImage);

                formData.menuImages.forEach((file, index) => {
                    formDataWithFiles.append(`menuImages`, file); // Use a flat name instead of indexed
                });
                formDataWithFiles.append('cuisines', JSON.stringify(formData.cuisines));
                formDataWithFiles.append('deliveryTimings', JSON.stringify(formData.deliveryTimings));

                // Debug FormData
                for (const [key, value] of formDataWithFiles.entries()) {
                    console.log(`${key}:`, value);
                }

                console.log("Append done! "); // debugging

                dataToSend = formDataWithFiles;
                headers['Content-Type'] = undefined;
            } else if (activeStep === 'restaurantDocuments') {

                console.log("Before URL"); // DEBUGGING
                endpoint = 'http://localhost:5000/api/restaurants/documents';
                console.log("After URL"); //debugging

                const formDataWithFiles = new FormData();

                formDataWithFiles.append('email', formData.email);

                if (formData.panCard) {
                    formDataWithFiles.append('panCard', formData.panCard);
                }

                if (formData.fssaiLicense) {
                    formDataWithFiles.append('fssaiLicense', formData.fssaiLicense);
                }

                formDataWithFiles.append('bankDetails', formData.bankDetails);

                formDataWithFiles.append('gstNumber', formData.gstNumber);


                // Debug FormData
                for (let pair of formDataWithFiles.entries()) {
                    console.log(`${pair[0]}:`, pair[1]); // Log keys and values
                }

                dataToSend = formDataWithFiles;
                delete headers['Content-Type'];

                // headers['Content-Type'] = undefined;
            }

            console.log("Before post"); // debugging

            console.log(`endpoint ${endpoint}`);  // debug
            console.log(`data to send ${dataToSend}`); // debug
            console.log(`Header ${headers}`);    // debug

            const response = await axios.post(endpoint, dataToSend, { headers });

            console.log("After post"); // debugging

            if (response.status === 201) {
                alert('Form submitted successfully!');
                if (activeStep === 'restaurantInfo') {
                    setActiveStep('menuDetails');
                }
                else if (activeStep === 'menuDetails') {
                    setActiveStep('restaurantDocuments');
                }
                else if (activeStep === 'restaurantDocuments') {
                    setActiveStep('');
                    navigate('/loginR');
                }
                else {
                    setActiveStep(''); // Reset or navigate as needed
                }

            } else {
                alert('Error submitting form.');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            alert('Failed to submit the form. Please try again.');
        }
    };


    const renderForm = () => {
        switch (activeStep) {
            case 'restaurantInfo':
                return (
                    <div className="form-section">
                        <h2>Restaurant Information</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Restaurant Name</label>
                                <input
                                    type="text"
                                    name="restaurantName"
                                    value={formData.restaurantName}
                                    onChange={handleChange}
                                    placeholder="Enter restaurant name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Owner's Name</label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    placeholder="Enter owner's name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div className="form-group">
                                <label>Owner's Mobile Number</label>
                                <input
                                    type="tel"
                                    name="ownerMobile"
                                    value={formData.ownerMobile}
                                    onChange={handleChange}
                                    placeholder="Enter owner's mobile number"
                                />
                            </div>
                            <div className="form-group">
                                <label>Restaurant's Primary Contact Number</label>
                                <input
                                    type="tel"
                                    name="primaryContact"
                                    value={formData.primaryContact}
                                    onChange={handleChange}
                                    placeholder="Enter primary contact number"
                                />
                            </div>
                            <h3>Restaurant Address Details</h3>
                            <div className="form-group">
                                <label>Shop No./Building No.</label>
                                <input
                                    type="text"
                                    name="address.shopNumber"
                                    value={formData.address.shopNumber}
                                    onChange={handleChange}
                                    placeholder="Enter shop or building number"
                                />
                            </div>
                            <div className="form-group">
                                <label>Floor/Tower (Optional)</label>
                                <input
                                    type="text"
                                    name="address.floor"
                                    value={formData.address.floor}
                                    onChange={handleChange}
                                    placeholder="Enter floor or tower"
                                />
                            </div>
                            <div className="form-group">
                                <label>Area/Sector/Locality</label>
                                <input
                                    type="text"
                                    name="address.area"
                                    value={formData.address.area}
                                    onChange={handleChange}
                                    placeholder="Enter area or locality"
                                />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                />
                            </div>
                            <div className="form-group">
                                <label>Nearby Landmark (Optional)</label>
                                <input
                                    type="text"
                                    name="address.landmark"
                                    value={formData.address.landmark}
                                    onChange={handleChange}
                                    placeholder="Enter nearby landmark"
                                />
                            </div>
                            <button type="submit" className="btn">Submit</button>
                        </form>
                    </div>
                );
            case 'menuDetails':
                return (
                    <div className="form-section">
                        <h2>Menu and Operational Details</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Menu Images</label>
                                <input type="file"
                                    name="menuImages"
                                    multiple

                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Restaurant Profile Image</label>
                                <input
                                    type="file"
                                    name="profileImage"

                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Select up to 3 Cuisines</label>
                                <div className="cuisine-container">
                                    {cuisines.map((cuisine, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`cuisine-button ${selectedCuisines.includes(cuisine)
                                                ? "selected"
                                                : ""
                                                }`}
                                            onClick={() => handleCuisineClick(cuisine)}
                                        >
                                            {cuisine}
                                        </button>
                                    ))}
                                </div>
                                <p>Selected Cuisines: {selectedCuisines.join(", ")}</p>
                            </div>

                            <div className="form-group">
                                <label>Restaurant Delivery Timings</label>
                                <div className="timing-inputs">
                                    <input
                                        type="time"
                                        placeholder="Open Time"
                                        name='deliveryTimings.openTime'
                                        value={formData.deliveryTimings.openTime}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="time"
                                        placeholder="Close Time"
                                        name='deliveryTimings.closeTime'
                                        value={formData.deliveryTimings.closeTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn">Submit</button>
                        </form>
                    </div>
                );
            case 'restaurantDocuments':
                return (
                    <div className="form-section">
                        <h2>Restaurant Documents</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>PAN Card</label>
                                <input
                                    type="file"
                                    name="panCard"
                                    onChange={handleFileChange} // Bind input to state
                                />
                            </div>
                            <div className="form-group">
                                <label>FSSAI License</label>
                                <input
                                    type="file"
                                    name="fssaiLicense"
                                    onChange={handleFileChange} // Bind input to state
                                />
                            </div>
                            <div className="form-group">
                                <label>Don't have a FSSAI license? <a href="#">Apply here</a></label>
                            </div>
                            <div className="form-group">
                                <label>Bank Account Details</label>
                                <input
                                    type="text"
                                    name="bankDetails"
                                    value={formData.bankDetails}
                                    onChange={handleChange} // Bind input to state
                                    placeholder="Enter bank account details"
                                />
                            </div>

                            <div className="form-group">
                                <label>GST Number (if applicable)</label>
                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleChange} // Bind input to state
                                    placeholder="Enter GST number"
                                />
                            </div>
                            <button type="submit" className="btn">Submit</button>
                        </form>
                    </div>
                );
            // case 'partnerContract':
            //     return (
            //         <div className="form-section">
            //             <h2>Partner Contract</h2>
            //             <form>
            //                 <div className="form-group">
            //                     <label>Upload Partner Contract</label>
            //                     <input type="file" />
            //                 </div>
            //                 <button type="submit" className="btn">Submit</button>
            //             </form>
            //         </div>
            //     );
            default:
                return null;
        }
    };

    return (
        <div className="registration-container">
            <div className="side-nav">
                <h3>Complete Your Registration</h3>
                <ul>
                    <li onClick={() => setActiveStep('restaurantInfo')} className={activeStep === 'restaurantInfo' ? 'active' : ''}>
                        Restaurant Info
                    </li>
                    <li onClick={() => setActiveStep('menuDetails')} className={activeStep === 'menuDetails' ? 'active' : ''}>
                        Menu and Operational Details
                    </li>
                    <li onClick={() => setActiveStep('restaurantDocuments')} className={activeStep === 'restaurantDocuments' ? 'active' : ''}>
                        Restaurant Documents
                    </li>
                    {/* <li onClick={() => setActiveStep('partnerContract')} className={activeStep === 'partnerContract' ? 'active' : ''}>
                        Partner Contract
                    </li> */}
                </ul>
            </div>
            <div className="form-content">
                {renderForm()}
            </div>
        </div>
    );
};

export default RegistrationR;