const express = require('express');
const router = express.Router();
const { Restaurant, Menu } = require('../models/Restaurant'); // Adjust the path if needed


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
                profileImage: menu ? menu.profileImage : null,
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

        res.status(200).json({
            restaurantName: restaurant.restaurantName,
            address: restaurant.address,
            profileImage: menu.profileImage,
            dishes: menu.dishes, // Ensure your Menu schema has a `dishes` array with `name` and `price`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch menu' });
    }
});






