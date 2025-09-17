"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_1 = require("../controllers/quiz");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/start', auth_1.authMiddleware, quiz_1.startQuiz);
router.post('/submit', auth_1.authMiddleware, quiz_1.submitQuiz);
exports.default = router;
