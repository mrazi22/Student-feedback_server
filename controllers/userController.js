const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        console.log("🔍 [Backend] Update Request Body:", req.body); // ✅ Debug incoming request

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // ✅ Update Name & Email
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // ✅ Update Password (Only if provided)
        if (req.body.password && req.body.password.trim() !== "") {
            console.log("🔑 [Backend] Updating password...");
            user.password = req.body.password; // ✅ Let Mongoose's `pre('save')` hook handle hashing
        }

        // ✅ Save Updated User
        const updatedUser = await user.save();
        
        console.log("✅ [Backend] User profile updated successfully!");

        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: jwt.sign({ id: updatedUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
        });

    } catch (error) {
        console.error("❌ [Backend] Error updating profile:", error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};



module.exports = { getUserProfile, updateUserProfile };