"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitQuiz = exports.startQuiz = void 0;
const db_1 = __importDefault(require("../utils/db"));
const startQuiz = async (req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM questions');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.startQuiz = startQuiz;
const submitQuiz = async (req, res) => {
    try {
        const answers = req.body; // { questionId: selectedOption }
        const result = await db_1.default.query('SELECT id, correct_option FROM questions');
        let score = 0;
        let correctCount = 0;
        result.rows.forEach((question) => {
            if (answers[question.id] === question.correct_option) {
                score += 1;
                correctCount += 1;
            }
        });
        res.json({
            totalScore: score,
            correctAnswers: correctCount,
            totalQuestions: result.rows.length,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.submitQuiz = submitQuiz;
