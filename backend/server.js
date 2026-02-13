const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security & Body Parser Middleware
app.use(helmet()); 
app.use(cors());
app.use(express.json()); // Essential for reading Postman data

// Mount Routes
app.use('/api/auth', authRoutes);

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Hazara University Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});