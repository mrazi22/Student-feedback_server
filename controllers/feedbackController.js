const Feedback = require('../models/Feedback');

// ✅ Create Feedback
const createFeedback = async (req, res) => {
    try {
        const { category, feedback } = req.body;
        const newFeedback = await Feedback.create({ 
            user: req.user.id, 
            category, 
            feedback 
        });
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};



// ✅ Get User's Feedback (For Users)
const getUserFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ user: req.user.id });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};

// ✅ Update Feedback
const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        if (feedback.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this feedback' });
        }

        feedback.feedback = req.body.feedback || feedback.feedback;
        await feedback.save();
        res.json({ message: 'Feedback updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback', error: error.message });
    }
};

// ✅ Delete Feedback
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        if (feedback.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this feedback' });
        }

        await feedback.deleteOne();
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error: error.message });
    }
};

module.exports = { createFeedback,  getUserFeedback, updateFeedback, deleteFeedback };