require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');




const app = express();

// Middleware to parse JSON Bodies
app.use(bodyParser.json());
app.use(cors());


connectDB;

//Routes
app.use('/api/auth', authRoutes);



const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})