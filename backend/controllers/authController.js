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
        const accessToken = jwt.sign({ id: user._id, version: user.tokenVersion }, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });

        // 4. Create Refresh Token (Long term - 7 days)
        const refreshToken = jwt.sign({ id: user._id, version: user.tokenVersion }, process.env.JWT_SECRET, {
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

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
exports.logout = (req, res) => {
    // We send a cookie with the same name but set it to expire immediately ('none')
    res.cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    });
};

// @desc    Logout from all devices (Invalidate all tokens)
// @route   GET /api/auth/logoutall
// @access  Private (Needs a token to call this)
exports.logoutAll = async (req, res) => {
    try {
        // Find the user and increment the tokenVersion by 1
        // This makes all old tokens (which have the old version) invalid
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { tokenVersion: 1 }
        });

        res.status(200).json({
            success: true,
            message: 'Successfully logged out from all devices. Please login again.'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};