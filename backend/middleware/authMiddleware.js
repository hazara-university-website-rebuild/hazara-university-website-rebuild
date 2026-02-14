const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find the user in the database
        const currentUser = await User.findById(decoded.id);
        
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }

        // --- THE GLOBAL LOGOUT CHECK ---
        // 4. Check if the token's version matches the database version
        // If you clicked 'Logout All', the DB version will be higher than the Token version
        if (decoded.version !== currentUser.tokenVersion) {
            return res.status(401).json({ 
                success: false, 
                message: 'Session expired due to global logout. Please login again.' 
            });
        }

        // Grant access and attach user to request
        req.user = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Rank Check (Authorize)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized`
            });
        }
        next();
    };
};