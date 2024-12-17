// const Restaurant = require('../models/restaurantModel');

// // Controller function for registering a restaurant
// const registerRestaurant = async (req, res) => {
//     try {
//         const {
//             restaurantName,
//             ownerName,
//             email,
//             ownerMobile,
//             primaryContact,
//             buildingNo,
//             floor,
//             area,
//             city,
//             landmark,
//             cuisines,
//             openTime,
//             closeTime,
//             bankDetails,
//             menuDetails,
//             gstNumber
//         } = req.body;

//         const restaurantData = new Restaurant({
//             restaurantName,
//             ownerName,
//             email,
//             ownerMobile,
//             primaryContact,
//             address: {
//                 buildingNo,
//                 floor,
//                 area,
//                 city,
//                 landmark
//             },
//             menuImages: req.files['menuImages']?.map(file => file.path),
//             profileImage: req.files['profileImage']?.[0]?.path,
//             cuisines: cuisines ? cuisines.split(',') : [],
//             deliveryTimings: {
//                 openTime,
//                 closeTime
//             },
//             panCard: req.files['panCard']?.[0]?.path,
//             fssaiLicense: req.files['fssaiLicense']?.[0]?.path,
//             bankDetails,
//             menuDetails,
//             dishImage: req.files['dishImage']?.[0]?.path,
//             gstNumber
//         });

//         await restaurantData.save();
//         res.status(201).json({ message: 'Restaurant Registered Successfully', data: restaurantData });
//     } catch (error) {
//         res.status(400).json({ message: 'Error Registering Restaurant', error: error.message });
//     }
// };

// module.exports = {
//     registerRestaurant
// };
