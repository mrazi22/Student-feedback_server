const Feedback = require('../models/Feedback');

// ✅ Sync Offline Feedback
const syncOfflineFeedback = async (req, res) => {
    try {
        const { feedbackList } = req.body; // Array of unsynced feedback

        const syncedFeedback = await Feedback.insertMany(feedbackList.map(feedback => ({
            user: req.user.id,
            category: feedback.category,
            feedback: feedback.feedback,
            isSynced: true
        })));

        res.json({ message: 'Offline feedback synced successfully', syncedFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error syncing offline feedback', error: error.message });
    }
};

module.exports = { syncOfflineFeedback };