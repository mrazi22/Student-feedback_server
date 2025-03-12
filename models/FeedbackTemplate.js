const mongoose = require("mongoose");

const FeedbackTemplateSchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true },
    questions: [
        {
            question: { type: String, required: true },
            choices: { type: [String], required: true } // ✅ Multiple-choice options
        }
    ],
}, { timestamps: true });

const FeedbackTemplate = mongoose.model("FeedbackTemplate", FeedbackTemplateSchema);
module.exports = FeedbackTemplate;