require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require("./routes/restaurantRoutes");
const connectDB = require('./config/db');
const restaurantDataRouted = require('./routes/restaurantDataRoute')
// const uploadRoutes = require("./routes/uploadRoutes");
const path = require('path');



const app = express();

// Middleware to parse JSON Bodies
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
}));


connectDB;

//Routes
app.use('/api/auth', authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/restaurantsData", restaurantDataRouted );

// app.use('/api', uploadRoutes); 


app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})