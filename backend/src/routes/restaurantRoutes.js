require('dotenv').config
const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { Restaurant, Menu, Document } = require('../models/Restaurant');
// const upload = require("./uploadRoutes");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

// // Multer configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads'); // Ensure 'uploads' folder exists and is writable
//     },
//     filename: (req, file, cb) => {
//         // const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, Date.now() + path.extname(file.originalname));
//         cb(null, uniqueName);
//     },
// });

// // // Initialize multer
// // const upload = multer({
// //     storage,
// //     fileFilter,
// //     limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
// // });

// // Define file filter for images
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (mimetype && extname) {
//         cb(null, true);
//     } else {
//         cb('Error: Images only!');
//     }
// };


// ********Previous code ********************** 
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
        // if (!req.file) {
        //     return res.status(400).send('No file uploaded.');
        // }

        // const imagePath = req.file.path.replace(/\\/g, '/'); // Normalize path for cross-platform compatibility

        // const restaurant = new Restaurant({
        //     image: imagePath, // Save the normalized file path
        // });

        // await restaurant.save(); // Save restaurant data

        // return res.status(200).json({
        //     message: 'File uploaded and restaurant data saved.',
        //     imagePath,
        // });

        // *********** Previous code ************
        if (!req.file && !req.files) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const restaurant = new Restaurant({
            image: req.file.path,  // Storing the file path in the database
        });

        await restaurant.save();  // Save the restaurant data with the image path

        return res.status(200).send('File uploaded and restaurant data saved.');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error. Please try again.');
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

        await newRestaurant.save(); // save 

        console.log("Save Done!");

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
    // const menuDetails = req.body.menuDetails;

    const email = req.body.email;

    const deliveryTimings = JSON.parse(req.body.deliveryTimings || '{}'); // Parse JSON

    // Validate fields
    if (!email || !cuisines || !deliveryTimings || !profileImage) {
        return res.status(400).json({ message: 'Missing required fields in menu' });
    }

    try {
        // Save menu details to DB
        const newMenu = new Menu({
            email,
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
router.post('/documents', upload.fields([{ name: 'panCard', maxCount: 1 }, { name: 'fssaiLicense', maxCount: 1 }]), async (req, res) => {

    console.log('In the backend!!');
    console.log('Headers:', req.headers);

    console.log("Files: ", req.files); //debugging
    console.log("Body: ", req.body);  // debugging


    const panCard = req.files?.['panCard']?.[0];
    const fssaiLicense = req.files?.['fssaiLicense']?.[0];

    const { email, bankDetails, gstNumber } = req.body;

    // Validate presence of files and fields

    if (!email || !panCard || !fssaiLicense || !bankDetails || !gstNumber) {
        return res.status(400).json({ message: 'Missing required fields or files.' });
    }

    console.log("VALIDATION DONE!"); // debugging

    try {
        // Save documents to DB
        const newDocument = new Document({
            email,
            panCard: panCard.path,
            fssaiLicense: fssaiLicense.path,
            bankDetails,
            gstNumber,
        });

        await newDocument.save();

        console.log("SAVED!!"); // debugging

        // Send response
        res.status(201).json({ message: 'Documents submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Could not save documents.' });
    }
});


// Login restro
router.post('/login', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Finding user in DB
        const restaurant = await Restaurant.findOne({ email });

        console.log(`Restaurant: ${restaurant}`);

        if (!restaurant) {
            return res.status(404).json({ message: 'Wrong Email' });
        }

        const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login Successful',
            token,
            restaurant
        });
    } catch (error) {
        console.error('Error in loggin:', error);
        res.status(500).json({ message: 'Error in loggin ', error: error.message });
    }
})


// Fetching Profile
router.get('/profile', authenticate, async (req, res) => {
    console.log('Fetching profile for restaurantId:', req.user.restaurantId); // Debugging
    try {
        const restaurant = await Restaurant.findById(req.user.restaurantId);
        if (!restaurant) {
            console.log('Restaurant not found for ID:', req.user.restaurantId); // Debugging
            return res.status(404).send('Restaurant not found');
        }
        res.json(restaurant);
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).send('Error fetching profile');
    }
});

// Update profile
router.put("/profile", authenticate, async (req, res) => {
    try {
        console.log("Arrived!");
        const { email, primaryContact, ownerName, restaurantName } = req.body;

        console.log("Request Body:", req.body); // Debugging the input payload

        // Ensure req.user.restaurantId exists
        if (!req.user || !req.user.restaurantId) {
            return res.status(400).send("Invalid restaurant ID");
        }

        console.log("At backend with ID:", req.user.restaurantId);

        // Updating selected fields only
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { _id: req.user.restaurantId },
            {
                $set: {
                    email,
                    primaryContact,
                    ownerName,
                    restaurantName,
                },
            },
            { new: true, runValidators: true } // runValidators ensures schema validation
        );

        if (!updatedRestaurant) {
            return res.status(404).send("Restaurant not found");
        } else {
            console.log("Updated successfully!", updatedRestaurant); // Debugging updated data
            res.status(200).json(updatedRestaurant);
        }


    } catch (error) {
        console.error("Error updating profile:", error); // Log the error for debugging
        res.status(500).send(error);
    }
});


// Add Menu
router.post("/addMenu", async (req, res) => {
    const { email, dishName, price } = req.body;

    // Validate input fields
    if (!email || !dishName || !price) {
        return res.status(400).json({ message: "Dish name and price are required" });
    }

    try {
        // Fetch the menu associated with the restaurant
        const menu = await Menu.findOneAndUpdate(
            { email },
            { $push: { menuDetails: { dishName, price } } },
            { new: true, upsert: false }
        );

        console.log(menu);//debug

        if (!menu) {
            console.log("Menu not found for restaurant ID:", req.user.restaurantId);
            return res.status(404).json({ message: "Menu not found for this restaurant" });
        }


        res.status(200).json({ message: 'Dish added successfully', menu });

    } catch (error) {
        console.error("Error updating menu details: ", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Get Menu 
router.get('/getMenu', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Find the restaurant by email and return only menuDetails
        const menu = await Menu.findOne({ email }, 'menuDetails');
        if (!menu) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }
        res.status(200).json(menu.menuDetails);
    } catch (error) {
        console.error('Error fetching menu details:', error);
        res.status(500).json({ message: 'Error fetching menu details.' });
    }
});


// Edit Menu
router.put('/editMenu', async (req, res) => {
    const { id, dishName, price } = req.body;
    try {
        const result = await Menu.updateOne({ 'menuDetails._id': id }, // Find the dish by its `_id` in `menuDetails`
            { $set: { 'menuDetails.$.dishName': dishName, 'menuDetails.$.price': price } } // Update the matching fields
        );

        if (result.nModified === 0) {
            return res.status(404).json({ message: 'Dish not found or no changes made' });
        }

        res.status(200).json({ message: 'Dish updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating dish' });
    }
});

// Delete Menu
router.delete('/deleteMenu/:id', async (req, res) => {
    const { id } = req.params;

    // const dishId = mongoose.Types.ObjectId(id);

    try {
        const result = await Menu.updateOne(
            { 'menuDetails._id': id }, // Match the dish by its _id in menuDetails
            { $pull: { menuDetails: { _id: id } } } // Remove the matching dish
        );

        if (result.nModified === 0) {
            return res.status(404).json({ message: 'Dish not found or already deleted' });
        }

        res.status(200).json({ message: 'Dish deleted successfully' });
    } catch (error) {
        console.error('Error deleting dish:', error);
        res.status(500).json({ error: 'Error deleting dish' });
    }
});


// Get Menu Images
router.get('/getMenuImages', async (req, res) => {
    const { email } = req.query; // Pass email as a query parameter
    console.log("At backend!"); // debugging
    try {
        const menu = await Menu.findOne({ email });

        console.log(`menu details ${menu}`);

        if (!menu) {
            console.log('Menu not found');
            return res.status(404).json({ message: 'Menu not found' });
        }



        console.log('Menu images fetched successfully');
        res.status(200).json(menu.menuImages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching menu images' });
    }
});







// Add Menu Image
router.post('/addMenuImage', upload.single('menuImage'), async (req, res) => {

    const { email } = req.body; // menuId is the unique identifier for the menu item
    // const menuImage = req.file; // Image file uploaded via multer
    const filePath = req.file?.path;


    console.log(req.file); //debug
    console.log(req.files); // debug

    // // Validate input fields
    // if (!email || !menuImage) {
    //     return res.status(400).json({ message: "Email and image file are required." });
    // }

    if (!email || !filePath) {
        return res.status(400).json({ message: "Email and image are required." });
    }

    try {
        // Update the menu item with the image path
        const menu = await Menu.findOneAndUpdate(
            { email }, // Find the document using the email field
            // { $push: { menuImages: menuImage.path } }, // Push the image path to the `menuImages` array
            { $push: { menuImages: filePath } },
            { new: true } // Return the updated document
        );

        if (!menu) {
            return res.status(404).json({ message: "Menu item not found." });
        }
        console.log("Updating done!");  //debug

        res.status(200).json({ message: "Menu image added successfully", menu });
    } catch (error) {
        console.error("Error adding menu image:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete Menu Image
router.delete('/deleteMenuImage', async (req, res) => {
    const { email, imagePath } = req.body;
    try {
        const menu = await Menu.findOneAndUpdate(
            { email },
            { $pull: { menuImages: imagePath } },
            { new: true }
        );
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.status(200).json({ message: 'Image deleted successfully', menuImages: menu.menuImages });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting menu image' });
    }
});


module.exports = router;