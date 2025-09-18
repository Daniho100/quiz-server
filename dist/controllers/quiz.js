"use strict";
// import { Request, Response } from 'express';
// import pool from '../utils/db';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitQuiz = exports.startQuiz = void 0;
const async_retry_1 = __importDefault(require("async-retry"));
const db_1 = __importDefault(require("../utils/db"));
const startQuiz = async (req, res) => {
    try {
        const questions = await (0, async_retry_1.default)(async () => {
            const { rows } = await db_1.default.query('SELECT * FROM questions ORDER BY RANDOM() LIMIT 10');
            if (!rows.length)
                throw new Error('No questions found');
            return rows;
        }, { retries: 3, minTimeout: 1000 });
        res.json(questions);
    }
    catch (error) {
        console.error('❌ startQuiz error:', error);
        res.status(500).json({ message: 'Server error', detail: error.message });
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
        }, { retries: 3, minTimeout: 1000 });
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
