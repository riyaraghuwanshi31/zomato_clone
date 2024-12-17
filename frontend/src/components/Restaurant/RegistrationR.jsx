import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationR.css';

const RegistrationR = () => {
    // const [activeStep, setActiveStep] = useState('restaurantInfo');
    // const [selectedCuisines, setSelectedCuisines] = useState([]);


    // const [formData, setFormData] = useState({
    //     restaurantName: "",
    //     ownerName: "",
    //     email: "",
    //     ownerMobile: "",
    //     primaryContact: "",
    //     address: {
    //         shopNumber: "",
    //         floor: "",
    //         area: "",                 
    //         city: "", 
    //         landmark: "",
    //     },
    //     cuisines: [],
    //     menuDetails: "",
    //     deliveryTimings: { open: "", close: "" },
    //     profileImage: null,
    //     menuImages: [],
    //     panCard: null,
    //     fssaiLicense: null,
    //     bankDetails: "",
    //     gstNumber: "",
    // });

    // const cuisines = ["Chinese", "Fast Food", "North Indian", "South Indian", "Biryani", "Pizza"];

    // const handleCuisineClick = (cuisine) => {
    //     const updatedCuisines = selectedCuisines.includes(cuisine)
    //         ? selectedCuisines.filter((item) => item !== cuisine)
    //         : [...selectedCuisines, cuisine];

    //     if (updatedCuisines.length > 3) {
    //         alert("You can select up to 3 cuisines only.");
    //         return;
    //     }

    //     setSelectedCuisines(updatedCuisines);
    //     setFormData({ ...formData, cuisines: updatedCuisines });
    // };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;

    //     if (name.includes("address.")) {
    //         const addressField = name.split(".")[1];
    //         setFormData({
    //             ...formData,
    //             address: {
    //                 ...formData.address,
    //                 [addressField]: value,
    //             },
    //         });
    //     } else if (name.includes("deliveryTimings.")) {
    //         const timingField = name.split(".")[1];
    //         setFormData({
    //             ...formData,
    //             deliveryTimings: {
    //                 ...formData.deliveryTimings,
    //                 [timingField]: value,
    //             },
    //         });
    //     } else {
    //         setFormData({ ...formData, [name]: value });
    //     }
    // };

    // const handleFileChange = (e) => {
    //     const { name, files } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: name === "menuImages" ? Array.from(files) : files[0],
    //     });
    // };

    // const validateForm = () => {
    //     if (!formData.restaurantName || !formData.ownerName || !formData.email) {
    //         alert("Please fill out all required fields.");
    //         return false;
    //     }
    //     if (activeStep === "menuDetails" && selectedCuisines.length === 0) {
    //         alert("Please select at least one cuisine.");
    //         return false;
    //     }
    //     return true;
    // };




    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!validateForm()) return;

    //     const endpoints = {
    //         restaurantInfo: "info",
    //         menuDetails: "menu",
    //         restaurantDocuments: "documents",
    //     };
    //     const apiUrl = `http://localhost:5000/api/restaurants/${endpoints[activeStep]}`;

    //     console.log(`Api URL is: ${apiUrl}`);  // Debugging

    //     console.log(formData); // debugging

    //     const data = new FormData();

    //     if (activeStep === 'restaurantInfo') {
    //         data.append('restaurantName', formData.restaurantName);
    //         data.append('ownerName', formData.ownerName);
    //         data.append('email', formData.email);
    //         data.append('ownerMobile', formData.ownerMobile);
    //         data.append('primaryContact', formData.primaryContact);
    //         data.append('shopNumber', formData.address.shopNumber);
    //         data.append('floor', formData.address.floor);
    //         data.append('area', formData.address.area);
    //         data.append('city', formData.address.city);
    //         data.append('landmark', formData.address.landmark);

    //         console.log(data);
    //     } else if (activeStep === 'menuDetails') {
    //         data.append('cuisines', JSON.stringify(formData.cuisines));
    //         data.append('deliveryTimings', JSON.stringify(formData.deliveryTimings));
    //         if (formData.profileImage) data.append('profileImage', formData.profileImage);
    //         formData.menuImages.forEach((file) => data.append('menuImages', file));
    //     } else if (activeStep === 'restaurantDocuments') {
    //         data.append('bankDetails', formData.bankDetails);
    //         data.append('gstNumber', formData.gstNumber);
    //         data.append('menuDetails', formData.menuDetails);
    //         if (formData.panCard) data.append('panCard', formData.panCard);
    //         if (formData.fssaiLicense) data.append('fssaiLicense', formData.fssaiLicense);
    //     }

    //     try {
    //         console.log("Entered into posting"); // debugging

    //         const response = await fetch(apiUrl, {
    //             method: 'POST',
    //             body: data,

    //         });

    //         const result = await response.json();

    //         if (response.ok) {
    //             console.log('After posting Response:', result); // debugging
    //             alert(result.message);

    //             if (activeStep !== 'restaurantDocuments') {
    //                 setActiveStep((prev) =>
    //                     prev === 'restaurantInfo' ? 'menuDetails' : 'restaurantDocuments'
    //                 );
    //             }
    //         } else {
    //             throw new Error(result.message || "Something went wrong");
    //         }
    //     } catch (error) {
    //         console.error("Frontend Error submitting form:", error); // debugging
    //         alert("Error: " + error.message);
    //     }
    // };



    const [activeStep, setActiveStep] = useState('restaurantInfo');
    const [selectedCuisines, setSelectedCuisines] = useState([]);
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
        menuDetails: '',
        dishImage: null,
        gstNumber: '',
    });




    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({
            ...formData,
            [name]: name === "menuImages" ? Array.from(files) : files[0],
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
        e.preventDefault();

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
                formDataWithFiles.append('profileImage', formData.profileImage);

                formData.menuImages.forEach((file, index) => {
                    formDataWithFiles.append(`menuImages[${index}]`, file);
                });

                formData.cuisines.forEach((cuisine) => {
                    formDataWithFiles.append('cuisines[]', cuisine);
                });

                formDataWithFiles.append('deliveryTimings', JSON.stringify(formData.deliveryTimings));

                console.log("Append done! "); // debugging

                dataToSend = formDataWithFiles;
                headers['Content-Type'] = 'multipart/form-data';
            } else if (activeStep === 'restaurantDocuments') {
                endpoint = 'http://localhost:5000/api/restaurants/documents';
                const formDataWithFiles = new FormData();
                formDataWithFiles.append('panCard', formData.panCard);
                formDataWithFiles.append('fssaiLicense', formData.fssaiLicense);
                formDataWithFiles.append('dishImage', formData.dishImage);
                formDataWithFiles.append('bankDetails', formData.bankDetails);
                formDataWithFiles.append('menuDetails', formData.menuDetails);
                formDataWithFiles.append('gstNumber', formData.gstNumber);
                dataToSend = formDataWithFiles;
                headers['Content-Type'] = 'multipart/form-data';
            }


            console.log("Before post"); // debugging
            
            const response = await axios.post(endpoint, dataToSend, { headers });

            console.log("After post"); // debugging

            if (response.status === 200) {
                alert('Form submitted successfully!');
                setActiveStep(''); // Reset or navigate as needed
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
                                <input type="file" />
                            </div>
                            <div className="form-group">
                                <label>FSSAI License</label>
                                <input type="file" />
                            </div>
                            <div className="form-group">
                                <label>Don't have a FSSAI license? <a href="#">Apply here</a></label>
                            </div>
                            <div className="form-group">
                                <label>Bank Account Details</label>
                                <input type="text" placeholder="Enter bank account details" />
                            </div>
                            <div className="form-group">
                                <label>Menu Details</label>
                                <textarea placeholder="Enter menu details"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Dish Image</label>
                                <input type="file" />
                            </div>
                            <div className="form-group">
                                <label>GST Number (if applicable)</label>
                                <input type="text" placeholder="Enter GST number" />
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