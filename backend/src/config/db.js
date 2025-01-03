const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://riyaraghuwanshi0831:zomatoclone@cluster0.5lps3.mongodb.net/Zomato?retryWrites=true&w=majority&appName=Cluster0',
            {}).then(() => console.log("Connection Successful"))
    } catch {
        (err) => console.log(err)
    }
};

module.exports = connectDB;
