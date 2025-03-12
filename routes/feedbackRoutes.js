const express = require('express');
const { createFeedback, getAllFeedback, getUserFeedback, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// User Routes
router.post('/', protect, createFeedback); // ✅ Create Feedback
router.get('/myfeedback', protect, getUserFeedback); // ✅ Get User's Feedback
router.put('/:id', protect, updateFeedback); // ✅ Update Feedback
router.delete('/:id', protect, deleteFeedback); // ✅ Delete Feedback



module.exports = router;