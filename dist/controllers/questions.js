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
        const result = await db_1.default.query('SELECT * FROM questions WHERE created_by = $1', [
            req.user.id,
        ]);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
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
        const result = await db_1.default.query('INSERT INTO questions (question_text, options, correct_option, created_by) VALUES ($1, $2, $3, $4) RETURNING *', [question_text, options, correct_option, req.user.id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createQuestion = createQuestion;
const updateQuestion = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const { question_text, options, correct_option } = req.body;
        const result = await db_1.default.query('UPDATE questions SET question_text = $1, options = $2, correct_option = $3 WHERE id = $4 AND created_by = $5 RETURNING *', [question_text, options, correct_option, id, req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateQuestion = updateQuestion;
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query('DELETE FROM questions WHERE id = $1 AND created_by = $2 RETURNING *', [id, req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteQuestion = deleteQuestion;
