const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    category: { type: String, required: true },
    feedback: { type: String, required: true },
    status: { type: String,  enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Feedback status
    isSynced: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);