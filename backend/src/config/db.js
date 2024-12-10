const mongoose = require('mongoose');


const connectDB = mongoose.connect('mongodb+srv://riyaraghuwanshi0831:zomatoclone@cluster0.5lps3.mongodb.net/Zomato?retryWrites=true&w=majority&appName=Cluster0',
    {}).then(() => console.log("Connection Successful"))
    .catch((err) => console.log(err));

module.exports = connectDB; 



// mongodb://kv47871:Lte0SNh6S4grItS7
// @FLiPRcluster.mongodb.net/?ssl=true&replicaSet=atlas-2jy2ys-shard-0&authSource=admin&retryWrites=true&w=majority&appName=FLiPRcluster"
