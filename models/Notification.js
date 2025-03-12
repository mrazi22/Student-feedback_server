const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Null means it's sent to all users
    createdAt: { type: String } // ✅ Store as a formatted string
});

// ✅ Pre-save hook to format date and time
NotificationSchema.pre('save', function (next) {
    const date = new Date();
    this.createdAt = date.toLocaleString('en-US', {
        month: 'short',  // Jan, Feb, etc.
        day: '2-digit',   // 01, 02, etc.
        year: 'numeric',  // 2025
        hour: '2-digit',  // 08, 09, etc.
        minute: '2-digit', // 30, 45, etc.
        hour12: true      // AM/PM format
    });
    next();
});

module.exports = mongoose.model('Notification', NotificationSchema);