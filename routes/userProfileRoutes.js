const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserProfile); // ✅ Get User Profile
router.put('/', protect, updateUserProfile); // ✅ Update User Profile

module.exports = router;