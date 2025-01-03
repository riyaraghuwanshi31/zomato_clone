require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const authRoutes = require('./src/routes/authRoutes');
const restaurantRoutes = require("./src/routes/restaurantRoutes");
const connectDB = require('./src/config/db');
const restaurantDataRouted = require('./src/routes/restaurantDataRoute');
const orderRoutes = require("./src/routes/orderRoutes");
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse JSON Bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Attach `io` to `req` for sharing across routes
app.use((req, res, next) => {
    req.io = io; // Use req.io instead of exporting io
    next();
});

app.use(cors({
    origin: ["http://localhost:5173"],
     // methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
     //    credentials: true
}));

connectDB();

// app.get('/', (req, res) => {
//     res.json("Hello");
// });

// Routes
app.use('/api/auth', authRoutes); // users
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/restaurantsData", restaurantDataRouted);
app.use("/api/orders", orderRoutes);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

const PORT = process.env.port || 5000;

server.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
