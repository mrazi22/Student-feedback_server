const express = require('express');
const { getAllUsers, updateUser, deleteUser, manageFeedback, getAllFeedback, updateFeedbackStatus, deleteFeedback, createFeedbackTemplate, getFeedbackTemplateByCategory, updateFeedbackTemplate, 
    deleteFeedbackTemplate, getAllFeedbackTemplates  } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
// ✅ Update User (Admin Only) - NEW ROUTE
router.put('/users/:id', protect, adminOnly, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.put('/feedback/:id', protect, adminOnly, manageFeedback);
// ✅ Get all feedback (Admin only)
router.get("/feedback/all", protect, adminOnly, getAllFeedback);

// ✅ Update feedback status (Admin only)
router.put("/feedback/:id", protect, adminOnly, updateFeedbackStatus);

// ✅ Delete feedback (Admin only)
router.delete("/feedback/:id", protect, adminOnly, deleteFeedback);

// ✅ Create Feedback Template (Admin Only)
router.post('/feedback-template', protect, adminOnly, createFeedbackTemplate);

// ✅ Get Feedback Template by Category
router.get('/feedback-template/:category', protect, getFeedbackTemplateByCategory);

// ✅ Update Feedback Template
router.put('/feedback-template/:category', protect, adminOnly, updateFeedbackTemplate);

// ✅ Delete Feedback Template
router.delete('/feedback-template/:category', protect, adminOnly, deleteFeedbackTemplate);

router.get("/feedback-templates", protect, adminOnly, getAllFeedbackTemplates);


module.exports = router;