const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname); // Use timestamp for unique file names
    }
});

// Initialize multer with the defined storage
const upload = multer({ storage });

// POST route to handle image upload
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Assuming you are storing the file path in a database
        // For example, saving the file path in your Restaurant model
        const restaurant = new Restaurant({
            image: req.file.path,  // Store the file path in the database
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

module.exports = router;
