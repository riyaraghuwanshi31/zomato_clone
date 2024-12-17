const express = require('express');
const multer = require('multer');
const { Restaurant, Menu, Document } = require('../models/Restaurant');

const router = express.Router();

// Configure multer for file uploads with file size limit and file type filter
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, JPEG, PNG are allowed.'));
        }
    }
});


// Define a route to upload a single image (e.g., profile picture for a restaurant)
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // You can also handle the file data here, such as saving the file path in the database
        // For example, save the file path in the `Restaurant` model, if needed
        const restaurant = new Restaurant({
            // Other fields can be added here, such as name, description, etc.
            image: req.file.path,  // Storing the file path in the database
        });

        await restaurant.save();  // Save the restaurant data with the image path

        return res.status(200).send('File uploaded and restaurant data saved.');
    } catch (err) {
        console.error(err);
        if (err instanceof multer.MulterError) {
            return res.status(400).send(`Multer Error: ${err.message}`);
        } else {
            return res.status(500).send('Server error. Please try again.');
        }
    }
});

// Restaurant Info API
router.post('/info', async (req, res) => {

    console.log('Request received:', req.body); // Debugging
    console.log('Received data:', req.body); // debugging

    try {
        const { restaurantName, ownerName, email, ownerMobile, primaryContact, address } = req.body;

        if (!restaurantName || !ownerName || !email || !ownerMobile || !primaryContact || !address) {
            console.log("Missing fields!"); // debugging

            return res.status(400).json({ message: 'Missing required fields' });
        }

        const { shopNumber, floor, area, city, landmark } = address;

        // Check if all address fields are provided
        if (!shopNumber || !floor || !area || !city || !landmark) {
            console.log("Missing address fields!"); // debugging

            return res.status(400).json({ message: 'Missing address fields' });
        }

        const newRestaurant = new Restaurant({
            restaurantName,
            ownerName,
            email,
            ownerMobile,
            primaryContact,
            address: { shopNumber, floor, area, city, landmark },
        });
        console.log("Done till storing, save left"); // debugging


        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant info submitted successfully' });
    } catch (error) {
        console.error('Error in /info route:', error.message);
        res.status(500).json({ message: 'Server error. Could not save restaurant info.' });
    }
});


// Menu Details API
router.post('/menu', upload.fields([{ name: 'profileImage' }, { name: 'menuImages', maxCount: 5 }]), async (req, res) => {

    // Extract uploaded files
    const profileImage = req.files['profileImage']?.[0]; // Single file
    const menuImages = req.files['menuImages'] || []; // Array of files

    console.log("Files: ", req.files); //debugging
    console.log("Body: ", req.body);  // debugging

    // Extract other fields
    const cuisines = req.body.cuisines?.split(','); // Split string to array
    const menuDetails = req.body.menuDetails;
    const deliveryTimings = JSON.parse(req.body.deliveryTimings || '{}'); // Parse JSON

    // Validate fields
    if (!cuisines || !deliveryTimings || !profileImage) {
        return res.status(400).json({ message: 'Missing required fields in menu' });
    }

    try {
        // Save menu details to DB
        const newMenu = new Menu({
            cuisines,
            deliveryTimings, // Already parsed
            profileImage: profileImage.path, // Save file path
            menuImages: menuImages.map(file => file.path), // Save paths of multiple files
        });

        await newMenu.save();

        // Send response
        res.status(201).json({ message: 'Menu details submitted successfully' });
    } catch (error) {
        console.error('Error in /menu route:', error);
        res.status(500).json({ message: 'Server error. Could not save menu details.' });
    }
});

// Documents API
router.post('/documents', upload.fields([{ name: 'panCard' }, { name: 'fssaiLicense' }]), async (req, res) => {
    const { bankDetails, gstNumber, menuDetails } = req.body;
    const panCard = req.files['panCard']?.[0];
    const fssaiLicense = req.files['fssaiLicense']?.[0];

    // Validate presence of files and required fields
    if (!panCard || !fssaiLicense) {
        return res.status(400).json({ message: 'Missing required document files' });
    }
    if (!bankDetails || !gstNumber || !menuDetails) {
        return res.status(400).json({ message: 'Missing required fields in documents' });
    }

    try {
        // Save documents to DB
        const newDocument = new Document({
            panCard: panCard.path,
            fssaiLicense: fssaiLicense.path,
            bankDetails,
            gstNumber,
            menuDetails,
        });

        await newDocument.save();

        // Send response
        res.status(201).json({ message: 'Documents submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Could not save documents.' });
    }
});

module.exports = router;
