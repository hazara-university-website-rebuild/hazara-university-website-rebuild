const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 1. Import the Security Guards from our middleware folder
const { protect, authorize } = require('../middleware/authMiddleware');

// --- PUBLIC ROUTES (Anyone can visit these) ---
router.post('/register', register);
router.post('/login', login);

// --- PRIVATE/ADMIN ROUTES (Only certain people can visit) ---

// Example: A route to get all users, but ONLY if you are an 'admin'
// We use 'protect' first to check the ID, then 'authorize' to check the Rank
router.get('/users', protect, authorize('admin'), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome Admin! You can see the secret user list."
    });
});

// It uses 'protect' to check if the ID card is valid. Used for already-logged-in
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user // Sends back the logged-in user's info (name, role, etc.)
    });
});

module.exports = router;