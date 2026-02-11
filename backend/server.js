const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');

// Load secret keys
dotenv.config();

const app = express();

// Security Guard (Middlewares)
app.use(helmet()); 
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Hazara University Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});