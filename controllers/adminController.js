const User = require('../models/User');
const Feedback = require('../models/Feedback');
const FeedbackTemplate = require("../models/FeedbackTemplate");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// ✅ Update User Profile (Admin Only)
const updateUser = async (req, res) => {
    try {
        const { name, email, isAdmin } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin; // Convert boolean

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

const manageFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        feedback.status = req.body.status; // Approve/Reject
        await feedback.save();
        res.json({ message: 'Feedback updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback' });
    }
};

// ✅ Get all feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find(); // Fetch all feedback
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedback" });
    }
};

// ✅ Update feedback status (Approve/Reject)
const updateFeedbackStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        feedback.status = status;
        await feedback.save();
        res.json({ message: "Feedback status updated", feedback });
    } catch (error) {
        res.status(500).json({ message: "Error updating feedback" });
    }
};

// ✅ Delete feedback
const deleteFeedback = async (req, res) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        await feedback.deleteOne();
        res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting feedback" });
    }
};

// ✅ Create Feedback Template with Multiple Choice Options
const createFeedbackTemplate = async (req, res) => {
    const { category, questions } = req.body;

    try {
        // Ensure category is unique
        const existingTemplate = await FeedbackTemplate.findOne({ category });
        if (existingTemplate) {
            return res.status(400).json({ message: 'Feedback template for this category already exists' });
        }

        // ✅ Save questions with multiple choices
        const newTemplate = new FeedbackTemplate({
            category,
            questions // This should be an array of { question, options }
        });

        await newTemplate.save();
        res.status(201).json({ message: 'Feedback template created successfully', template: newTemplate });
    } catch (error) {
        res.status(500).json({ message: 'Error creating feedback template', error: error.message });
    }
};

// ✅ Get Feedback Template by Category
const getFeedbackTemplateByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const template = await FeedbackTemplate.findOne({ category });
        if (!template) {
            return res.status(404).json({ message: 'No feedback template found for this category' });
        }

        res.json(template);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback template', error: error.message });
    }
};

// ✅ Update Feedback Template
const updateFeedbackTemplate = async (req, res) => {
    const { category } = req.params;
    const { questions } = req.body;

    try {
        const template = await FeedbackTemplate.findOne({ category });
        if (!template) {
            return res.status(404).json({ message: 'Feedback template not found' });
        }

        // ✅ Update questions
        template.questions = questions;
        await template.save();

        res.json({ message: 'Feedback template updated successfully', template });
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback template', error: error.message });
    }
};

// ✅ Delete Feedback Template
const deleteFeedbackTemplate = async (req, res) => {
    const { category } = req.params;

    try {
        const template = await FeedbackTemplate.findOne({ category });
        if (!template) {
            return res.status(404).json({ message: 'Feedback template not found' });
        }

        await template.deleteOne();
        res.json({ message: 'Feedback template deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback template', error: error.message });
    }
};

// ✅ Fetch all feedback templates (Admin)
const getAllFeedbackTemplates = async (req, res) => {
    try {
        const templates = await FeedbackTemplate.find(); // Fetch all templates
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedback templates", error: error.message });
    }
};

module.exports = { getAllUsers, updateUser, deleteUser, manageFeedback, getAllFeedback, updateFeedbackStatus, deleteFeedback, createFeedbackTemplate, getFeedbackTemplateByCategory, updateFeedbackTemplate,
    deleteFeedbackTemplate, getAllFeedbackTemplates };