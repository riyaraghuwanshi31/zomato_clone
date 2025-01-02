require('dotenv').config();
const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const { Restaurant, Menu, Document } = require('../models/Restaurant');
const authenticate = require("../middleware/authenticate");


const router = express.Router();

// Configure multer for file uploads  //image add krne ke liye
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, JPEG, PNG are allowed.'));
        }
    }
});

// Upload Route
router.post('/upload', upload.single('image'), async (req, res) => {   // upload ka hi hai image   // menu mein 16 or 17 number ke menu ki details sahi hai bs or load hone mein time lagara hai kyunki images add kari hai 

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const newRestaurant = new Restaurant({ image: req.file.path });
        await newRestaurant.save();

        res.status(200).send('File uploaded and restaurant data saved.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});

// Restaurant Info API
router.post('/info', async (req, res) => {
    try {
        const { restaurantName, ownerName, email, ownerMobile, primaryContact, address } = req.body;

        if (!restaurantName || !ownerName || !email || !ownerMobile || !primaryContact || !address) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const { shopNumber, floor, area, city, landmark } = address;
        if (!shopNumber || !floor || !area || !city || !landmark) {
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

        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant info submitted successfully' });
    } catch (error) {
        console.error('Error in /info route:', error.message);
        res.status(500).json({ message: 'Server error. Could not save restaurant info.' });
    }
});



router.post(
    '/menu',
    upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'menuImages', maxCount: 5 }]),
    async (req, res) => {
        try {
            const { email, deliveryTimings } = req.body;

            if (!email || !deliveryTimings || !req.files['profileImage']) {
                return res.status(400).json({ message: 'Missing required fields.' });
            }

            const profileImage = req.files['profileImage'][0];
            const menuImages = req.files['menuImages'] || [];

            const newMenu = new Menu({
                email,
                // cuisines: cuisines.split(','),
                deliveryTimings: JSON.parse(deliveryTimings),
                profileImage: {
                    data: fs.readFileSync(profileImage.path), // Read profile image file as Buffer
                    contentType: profileImage.mimetype,
                },
                menuImages: menuImages.map(file => ({
                    data: fs.readFileSync(file.path), // Read each menu image file as Buffer
                    contentType: file.mimetype,
                })),
            });

            await newMenu.save();

            fs.unlinkSync(profileImage.path); // Remove profile image file
            menuImages.forEach(file => fs.unlinkSync(file.path)); // Remove each menu image file

            res.status(201).json({ message: 'Menu uploaded successfully.', menu: newMenu });
        } catch (error) {
            console.error('Error in /menu route:', error.message);
            res.status(500).json({ message: 'Server error.', error: error.message });
        }
    }
);

// Documents API
router.post('/documents', upload.fields([{ name: 'panCard', maxCount: 1 }, { name: 'fssaiLicense', maxCount: 1 }]), async (req, res) => {
    try {
        const { email, bankDetails, gstNumber } = req.body;

        const panCard = req.files['panCard']?.[0];
        const fssaiLicense = req.files['fssaiLicense']?.[0];

        if (!email || !panCard || !fssaiLicense || !bankDetails || !gstNumber) {
            return res.status(400).json({ message: 'Missing required fields or files.' });
        }

        const newDocument = new Document({
            email,
            panCard: panCard.path,
            fssaiLicense: fssaiLicense.path,
            bankDetails,
            gstNumber,
        });

        await newDocument.save();
        res.status(201).json({ message: 'Documents submitted successfully' });
    } catch (error) {
        console.error('Error in /documents route:', error.message);
        console.log("Error is coming!");
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
        // Fetch the restaurant details

        const restaurant = await Restaurant.findById(req.user.restaurantId);
        if (!restaurant) {
            console.log('Restaurant not found for ID:', req.user.restaurantId); // Debugging
            return res.status(404).send('Restaurant not found');
        }

        // Fetch the menu details using the restaurant's email
        const menu = await Menu.findOne({ email: restaurant.email });
        console.log("Fetched Menu: ", menu);
        if (!menu) {
            console.log('Menu not found for email:', restaurant.email); // Debugging
            return res.status(404).send('Menu not found');
        }

        // Extract the cuisines array from the menu
        const cuisines = menu.cuisines;

        // Respond with both restaurant details and cuisines
        res.json({
            ...restaurant.toObject(),
            cuisines: cuisines || [] // Include cuisines, or an empty array if none exist
        });

    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).send('Error fetching profile');
    }
});


// // Fetching Profile Previous new 
// router.get('/profile', authenticate, async (req, res) => {
//     console.log('Fetching profile for restaurantId:', req.user.restaurantId); // Debugging
//     try {
//         const restaurant = await Restaurant.findById(req.user.restaurantId);
//         if (!restaurant) {
//             console.log('Restaurant not found for ID:', req.user.restaurantId); // Debugging
//             return res.status(404).send('Restaurant not found');
//         }

//         const email = restaurant.email;
//         const menu = await Menu.findOne(email);



//         res.json(restaurant);
//     } catch (error) {
//         console.error('Error fetching profile:', error.message);
//         res.status(500).send('Error fetching profile');
//     }
// });

// Update profile
router.put("/profile", authenticate, async (req, res) => {
    try {
        console.log("Arrived at backend for updating profile!");
        const { email, primaryContact, ownerName, restaurantName, cuisines } = req.body;

        console.log("Request Body:", req.body); // Debugging the input payload

        // Ensure req.user.restaurantId exists
        if (!req.user || !req.user.restaurantId) {
            return res.status(400).send("Invalid restaurant ID");
        }

        console.log("At backend with restaurant ID:", req.user.restaurantId);

        // Ensure cuisines is processed correctly
        let cuisinesArray;
        if (Array.isArray(cuisines)) {
            cuisinesArray = cuisines; // If already an array, use as-is
        } else if (typeof cuisines === 'string') {
            cuisinesArray = cuisines.split(',').map(c => c.trim()); // Split string into array
        } else {
            return res.status(400).send("Invalid cuisines format");
        }

        console.log("Processed Cuisines Array:", cuisinesArray);

        // Update restaurant details
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
            { new: true, runValidators: true } // Ensure validation is applied
        );

        if (!updatedRestaurant) {
            return res.status(404).send("Restaurant not found");
        }

        console.log("Updated restaurant details successfully!");

        // Replace cuisines in the Menu schema
        const updatedMenu = await Menu.findOneAndUpdate(
            { email: updatedRestaurant.email }, // Match menu by restaurant's email
            { $set: { cuisines: cuisinesArray } }, // Replace cuisines with the new array
            { new: true, runValidators: true }
        );

        if (!updatedMenu) {
            console.log("Menu not found for email:", updatedRestaurant.email); // Debugging
            return res.status(404).send("Menu not found");
        }

        console.log("Cuisines replaced successfully!", updatedMenu.cuisines);

        // Respond with the updated profile, including cuisines
        res.status(200).json({
            ...updatedRestaurant.toObject(),
            cuisines: updatedMenu.cuisines,
        });
    } catch (error) {
        console.error("Error updating profile:", error.message); // Log the error for debugging
        res.status(500).send({ error: error.message });
    }
});


// Add Menu
router.post("/addMenu", async (req, res) => {
    const { email, dishName, price, cuisine } = req.body;

    // Validate input fields
    if (!email || !dishName || !price || !cuisine) {
        return res.status(400).json({ message: "Dish name, price, and cuisine are required." });
    }

    try {
        // Fetch the menu associated with the restaurant
        const menu = await Menu.findOneAndUpdate(
            { email },
            { $push: { menuDetails: { dishName, price, cuisine } } },
            { new: true, upsert: false }
        );

        if (!menu) {
            return res.status(404).json({ message: "Menu not found for this restaurant" });
        }

        res.status(200).json({ message: 'Dish added successfully', menu });
    } catch (error) {
        console.error("Error updating menu details: ", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



// Get Menu  khula rehne du ye ?
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


// Edit Menu  // is dashboard done
router.put('/editMenu', async (req, res) => {
    const { id, dishName, price, cuisine } = req.body;

    if (!id || !dishName || !price || !cuisine) {
        return res.status(400).json({ message: "Dish ID, name, price, and cuisine are required." });
    }

    try {
        const result = await Menu.updateOne({ 'menuDetails._id': id }, // Find the dish by its `_id` in `menuDetails`
            { $set: { 'menuDetails.$.dishName': dishName, 'menuDetails.$.price': price, 'menuDetails.$.cuisine': cuisine } } // Update the matching fields
        );

        if (result.nModified === 0) {
            return res.status(404).json({ message: 'Dish not found or no changes made' });
        }

        res.status(200).json({ message: 'Dish updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating dish' });
    }
});

// Delete Menu  repeat
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


// Get Menu Image 
router.get('/getMenuImages', async (req, res) => {
    const { email } = req.query; // Pass email as a query parameter
    try {
        const menu = await Menu.findOne({ email });

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }

        // Convert Buffer data to Base64 for all images
        const images = menu.menuImages.map(image => {
            if (image.data) {
                return `data:${image.contentType};base64,${image.data.toString('base64')}`;
            }
            return null;
        });

        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching menu images:', error);
        res.status(500).json({ error: 'Error fetching menu images' });
    }
});



// Add menu images
router.post('/addMenuImage', upload.single('menuImage'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    if (!email || !file) {
        return res.status(400).json({ message: 'Email and image are required.' });
    }

    try {
        const menu = await Menu.findOneAndUpdate(
            { email },
            {
                $push: {
                    menuImages: {
                        data: fs.readFileSync(file.path), // Read file as Buffer
                        contentType: file.mimetype,
                    },
                },
            },
            { new: true }
        );

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }

        res.status(200).json({ message: 'Menu image added successfully', menu });
    } catch (error) {
        console.error('Error adding menu image:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
    // finally {
    //     // Remove the file after processing
    //     fs.unlinkSync(file.path);
    // }
});




// // Add Menu Image PREVIOUS
// router.post('/addMenuImage', upload.single('menuImage'), async (req, res) => {

//     const { email } = req.body; // menuId is the unique identifier for the menu item
//     // const menuImage = req.file; // Image file uploaded via multer
//     const filePath = req.file?.path;


//     console.log(req.file); //debug
//     console.log(req.files); // debug

//     // // Validate input fields
//     // if (!email || !menuImage) {
//     //     return res.status(400).json({ message: "Email and image file are required." });
//     // }

//     if (!email || !filePath) {
//         return res.status(400).json({ message: "Email and image are required." });
//     }

//     try {
//         // Update the menu item with the image path
//         const menu = await Menu.findOneAndUpdate(
//             { email }, // Find the document using the email field
//             // { $push: { menuImages: menuImage.path } }, // Push the image path to the `menuImages` array
//             { $push: { menuImages: filePath } },
//             { new: true } // Return the updated document
//         );

//         if (!menu) {
//             return res.status(404).json({ message: "Menu item not found." });
//         }
//         console.log("Updating done!");  //debug

//         res.status(200).json({ message: "Menu image added successfully", menu });
//     } catch (error) {
//         console.error("Error adding menu image:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });


// Delete Menu Image
router.delete('/deleteMenuImage', async (req, res) => {
    const { email, imagePath } = req.body;

    // Validate input
    if (!email || !imagePath) {
        return res.status(400).json({ message: 'Email and imagePath are required' });
    }

    try {
        // Find the menu by email
        const menu = await Menu.findOne({ email });
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }

        // Filter out the image to be deleted
        const updatedImages = menu.menuImages.filter(image => {
            if (!image || !image.contentType || !image.data) {
                console.warn('Invalid image object:', image);
                return true; // Keep invalid image entries for debugging
            }

            // Construct the base64 path to compare
            const currentImagePath = `data:${image.contentType};base64,${image.data.toString('base64')}`;
            return currentImagePath !== imagePath;
        });

        // Check if the image was actually deleted
        if (updatedImages.length === menu.menuImages.length) {
            return res.status(404).json({ message: 'Image not found in the menu' });
        }

        // Update the menu and save
        menu.menuImages = updatedImages;
        await menu.save();

        res.status(200).json({ message: 'Image deleted successfully', menuImages: updatedImages });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Error deleting image' });
    }
});


// // Delete Menu Image PREVIOUS
// router.delete('/deleteMenuImage', async (req, res) => {
//     const { email, imagePath } = req.body;
//     try {
//         const menu = await Menu.findOneAndUpdate(
//             { email },
//             { $pull: { menuImages: imagePath } },
//             { new: true }
//         );
//         if (!menu) {
//             return res.status(404).json({ message: 'Menu not found' });
//         }
//         res.status(200).json({ message: 'Image deleted successfully', menuImages: menu.menuImages });
//     } catch (error) {
//         res.status(500).json({ error: 'Error deleting menu image' });
//     }
// });


module.exports = router;