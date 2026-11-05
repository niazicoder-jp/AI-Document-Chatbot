import express from "express";
import { generateAnswer } from "../services/aiService.js";

const router = express.Router();

// CHAT API ROUTE
router.post("/", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a question."
            });
        }

        const result = await generateAnswer(question);

        return res.status(200).json({
            success: true,
            answer: result.answer,
            sources: result.sources
        });

    } catch (error) {
        console.error("Chat error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while generating the answer."
        });
    }
});

export default router;
