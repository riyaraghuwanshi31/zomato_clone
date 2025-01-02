const express = require('express');
const router = express.Router();
const { Restaurant, Menu } = require('../models/Restaurant'); // Adjust the path if needed
const User = require("../models/User");


// API to fetch restaurant names, cuisines, and filter by location
router.get('/getRestaurant', async (req, res) => {
    try {
        const { location, query } = req.query;

        // Ensure location is processed correctly for filtering
        const restaurantFilter = location ? { 'address.city': { $regex: location, $options: 'i' } } : {};

        // Fetch data
        const restaurants = await Restaurant.find(restaurantFilter, 'restaurantName email address');
        const menus = await Menu.find({}, 'email cuisines profileImage deliveryTimings');

        // Combine restaurant and menu data
        const data = restaurants.map((restaurant) => {
            const menu = menus.find((m) => m.email === restaurant.email);
            return {
                restaurantName: restaurant.restaurantName,
                cuisines: menu ? menu.cuisines : [],
                profileImage: menu?.profileImage?.data
                    ? `data:${menu.profileImage.contentType};base64,${menu.profileImage.data.toString('base64')}`
                    : null,
                deliveryTime: menu ? menu.deliveryTimings : null,
                location: restaurant.address.city,
            };
        });

        // Filter by query if provided
        const filteredData = query
            ? data.filter(item =>
                item.restaurantName.toLowerCase().includes(query.toLowerCase()) ||
                item.cuisines.some(cuisine => cuisine.toLowerCase().includes(query.toLowerCase()))
            )
            : data;

        // Return filtered data
        res.status(200).json(filteredData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch data' });
    }
});


// API to fetch menu for a specific restaurant
router.get('/getMenu', async (req, res) => {
    try {
        const { restaurantName } = req.query;

        // Find the restaurant by name
        const restaurant = await Restaurant.findOne({ restaurantName });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Find the menu for the restaurant
        const menu = await Menu.findOne({ email: restaurant.email });

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found for the restaurant' });
        }

        const images = menu.menuImages.map(image => {
            if (image.data) {
                return `data:${image.contentType};base64,${image.data.toString('base64')}`;
            }
            return null; // Handle invalid data gracefully
        });

        let cuisines = [];
        try {
            cuisines = typeof menu.cuisines === 'string' ? JSON.parse(menu.cuisines) : menu.cuisines;
        } catch (err) {
            console.error('Error parsing cuisines:', err);
        }

        console.log(`Restro Email (Backend): ${restaurant.email}`); // debugging

        res.status(200).json({
            restaurantEmail: restaurant.email,
            restaurantName: restaurant.restaurantName,
            address: restaurant.address,
            cuisines: cuisines,
            deliveryTimings: menu.deliveryTimings,
            menuImages: images,
            menuDishName: menu.menuDetails.dishName,
            primaryContact: restaurant.primaryContact,
            dishes: menu.menuDetails.map(dish => ({
                name: dish.dishName,
                price: dish.price,
                cuisine: dish.cuisine
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch menu' });
    }
});


// Fetching users data
router.get('/userData', async (req, res) => {

    const { email } = req.query;

    console.log("Entered backend!");  // debugging
    if (!email) {
        return res.status(400).json({ error: 'Email query parameter is required' });
    }
    try {
        console.log("Finding Email");  // debugging
        const user = await User.findOne({ email });

        console.log("Finding email done"); // debugging 

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log("Sending data!");
        res.json(user);
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});





module.exports = router; 

