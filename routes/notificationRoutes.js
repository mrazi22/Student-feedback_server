const express = require('express');
const { sendNotification, getAllNotifications, getUserNotifications } = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin Routes
router.post('/', protect, adminOnly, sendNotification); // ✅ Send Notification
router.get('/all', protect, adminOnly, getAllNotifications); // ✅ Get All Notifications

// User Route
router.get('/my', protect, getUserNotifications); // ✅ Get User Notifications

module.exports = router;