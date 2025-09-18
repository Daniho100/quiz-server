"use strict";
// import { Router } from 'express';
// import { startQuiz, submitQuiz } from '../controllers/quiz';
// import { authMiddleware } from '../middleware/auth';
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.get('/start', authMiddleware, startQuiz);
// router.post('/submit', authMiddleware, submitQuiz);
// export default router;
const express_1 = require("express");
const quiz_1 = require("../controllers/quiz");
const auth_1 = require("../middleware/auth");
const timeOutMid_1 = require("../middleware/timeOutMid");
const router = (0, express_1.Router)();
router.get('/start', auth_1.authMiddleware, (0, timeOutMid_1.retryTimeoutMiddleware)({ requestTimeout: 15000 })(quiz_1.startQuiz) // 15s timeout
);
router.post('/submit', auth_1.authMiddleware, (0, timeOutMid_1.retryTimeoutMiddleware)({ requestTimeout: 15000 })(quiz_1.submitQuiz) // 15s timeout
);
exports.default = router;
