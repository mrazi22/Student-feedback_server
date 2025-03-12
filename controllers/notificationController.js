const Notification = require('../models/Notification');

// ✅ Send Notification (Admin Only)
const sendNotification = async (req, res) => {
    try {
        const { title, message, recipient } = req.body;

        const newNotification = await Notification.create({ title, message, recipient });
        res.status(201).json({ message: 'Notification sent successfully', notification: newNotification });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notification', error: error.message });
    }
};

// ✅ Get All Notifications (For Admin)
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

// ✅ Get User Notifications (For Logged-in Users)
const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ $or: [{ recipient: req.user.id }, { recipient: null }] }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

module.exports = { sendNotification, getAllNotifications, getUserNotifications };