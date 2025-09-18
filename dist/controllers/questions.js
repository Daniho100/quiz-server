"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestions = void 0;
const db_1 = __importDefault(require("../utils/db"));
const express_validator_1 = require("express-validator");
const getQuestions = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        const result = await db_1.default.query("SELECT * FROM questions");
        res.json(result.rows);
    }
    catch (error) {
        console.error("❌ getQuestions error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getQuestions = getQuestions;
const createQuestion = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { question_text, options, correct_option } = req.body;
        const result = await db_1.default.query(`INSERT INTO questions (question_text, options, correct_option)
       VALUES ($1, $2::jsonb, $3)
       RETURNING *`, [question_text, JSON.stringify(options), correct_option]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("❌ createQuestion error:", error);
        res.status(500).json({ message: "Server error", detail: error.message });
    }
};
exports.createQuestion = createQuestion;
const updateQuestion = async (req, res) => {
    console.log("update logic hit");
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const { question_text, options, correct_option } = req.body;
        const result = await db_1.default.query(`UPDATE questions
       SET question_text = $1, options = $2::jsonb, correct_option = $3
       WHERE id = $4
       RETURNING *`, [question_text, JSON.stringify(options), correct_option, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("❌ updateQuestion error:", error);
        res.status(500).json({ message: "Server error", detail: error.message });
    }
};
exports.updateQuestion = updateQuestion;
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user; // bypasses TS checks
        let result;
        if (user.role === 'admin') {
            // Admin can delete any question
            result = await db_1.default.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
        }
        else {
            // Normal user can delete only their own questions
            result = await db_1.default.query('DELETE FROM questions WHERE id = $1 AND created_by = $2 RETURNING *', [id, user.id]);
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteQuestion = deleteQuestion;
