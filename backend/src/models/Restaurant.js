const mongoose = require("mongoose");

// Restaurant Schema
const restaurantSchema = new mongoose.Schema({
    restaurantName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    ownerMobile: { type: String, required: true },
    primaryContact: { type: String, required: true },
    address: {
        shopNumber: { type: String, required: true },
        floor: { type: String, required: true },
        area: { type: String, required: true },
        city: { type: String, required: true },
        landmark: { type: String, required: true },
    }
});

// Menu Schema    //rukja yaar sun ni para 
const menuSchema = new mongoose.Schema({
    email: { type: String, required: true },
    cuisines: [{ type: String }], // Array of cuisines

    deliveryTimings: {
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
    },
    profileImage: {
        data: Buffer,
        contentType: String,
    }, // File path for profile image
    menuImages: [{
        data: Buffer,
        contentType: String,
    }], // Array of file paths for menu images
    menuDetails: [{         // iski detail registration ke time ni lere ruk dekh 
        dishName: { type: String },
        price: { type: String },
        cuisine: { type: String },
    }] //right ha toh vesa hi hoga dashboard pr
});                                               
        
//
// Document Schema 
const documentSchema = new mongoose.Schema({    
    email: { type: String, required: true },
    panCard: {
        data: Buffer, // Binary data
        contentType: String, // MIME type 
    },
    fssaiLicense: {
        data: Buffer,
        contentType: String,
    }, // File path for FSSAI license
    bankDetails: { type: String, required: true }, // Bank account details text
    gstNumber: { type: String }, // GST number (optional)
});

// Export Models
module.exports = {
    Restaurant: mongoose.model("Restaurant", restaurantSchema),
    Menu: mongoose.model("Menu", menuSchema),
    Document: mongoose.model("Document", documentSchema),
};
