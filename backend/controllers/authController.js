const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 2. Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Create Access Token (Short term - 15 mins)
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });

        // 4. Create Refresh Token (Long term - 7 days)
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // 5. Send Refresh Token in a secure cookie
        const options = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true, // Secure: JS cannot touch this cookie
            secure: process.env.NODE_ENV === 'production' ? true : false
        };

        res.status(200).cookie('refreshToken', refreshToken, options).json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};