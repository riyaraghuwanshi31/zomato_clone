import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashPhotos = ({ email }) => {
    const [menuImage, setImages] = useState([]); // Fixed naming convention for clarity
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch images on component mount or email change
    useEffect(() => {
        const fetchImages = async () => {
            if (!email) {
                console.warn('Email is undefined');
                return;
            }

            try {
                console.log(`Fetching images for email: ${email}`);
                const response = await axios.get(
                    `http://localhost:5000/api/restaurants/getMenuImages?email=${email}`
                );
                if (response.data && Array.isArray(response.data)) {
                    setImages(response.data); // Ensure data is in the expected format
                } else {
                    console.warn('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, [email]);

    // Handle file upload
    const handleUpload = async () => {
        if (!selectedFile) {
            console.warn('No file selected for upload');
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('menuImage', selectedFile);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/restaurants/addMenuImage',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } } // Correct headers
            );

            if (response.data && Array.isArray(response.data.menuImages)) {
                setImages(response.data.menuImages); // Update state with new images
            } else {
                console.warn('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Handle image deletion
    const handleDelete = async (imagePath) => {
        try {
            const response = await axios.delete('http://localhost:5000/api/restaurants/deleteMenuImage', {
                data: { email, imagePath },
            });
            setImages(response.data.menuImages); // Update images
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    // Ensure robust rendering even with no images
    return (
        <section className="photos-section"> 
            <h3>Restaurant Photos</h3>
            <div className="photo-gallery">
                {menuImage && menuImage.length > 0 ? (
                    menuImage.map((image, index) => (
                        <div key={index} className="photo-item">
                        <img src={`http://localhost:5000/${image.replace(/\\/g, '/')}`} alt={`Restaurant ${index}`} />

                            <button onClick={() => handleDelete(image)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No images available</p>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload</button>
        </section>
    );
};

export default DashPhotos;
