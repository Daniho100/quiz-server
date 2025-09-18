"use strict";
// import { Router } from 'express';
// import {
//   getQuestions,
//   createQuestion,
//   updateQuestion,
//   deleteQuestion,
// } from '../controllers/questions';
// import { authMiddleware } from '../middleware/auth';
// import { body, param } from 'express-validator';
// import { adminMiddleware } from '../middleware/admin';
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.get('/', authMiddleware, getQuestions);
// router.post(
//   '/',
//   [
//     authMiddleware, adminMiddleware,
//     body('question_text').notEmpty(),
//     body('options').isArray({ min: 4, max: 4 }),
//     body('correct_option').isInt({ min: 0, max: 3 }),
//   ],
//   createQuestion
// );
// router.put(
//   '/:id',
//   [
//     authMiddleware, adminMiddleware,
//     param('id').isInt(),
//     body('question_text').notEmpty(),
//     body('options').isArray({ min: 4, max: 4 }),
//     body('correct_option').isInt({ min: 0, max: 3 }),
//   ],
//   updateQuestion
// );
// router.delete('/:id', [authMiddleware, adminMiddleware, param('id').isInt()], deleteQuestion);
// export default router;
const express_1 = require("express");
const questions_1 = require("../controllers/questions");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const express_validator_1 = require("express-validator");
const timeOutMid_1 = require("../middleware/timeOutMid");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, (0, timeOutMid_1.retryTimeoutMiddleware)({ requestTimeout: 15000 })(questions_1.getQuestions) // 15s timeout
);
router.post('/', [
    auth_1.authMiddleware,
    admin_1.adminMiddleware,
    (0, express_validator_1.body)('question_text').notEmpty(),
    (0, express_validator_1.body)('options').isArray({ min: 4, max: 4 }),
    (0, express_validator_1.body)('correct_option').isInt({ min: 0, max: 3 }),
], (0, timeOutMid_1.retryTimeoutMiddleware)({ requestTimeout: 15000 })(questions_1.createQuestion));
router.put('/:id', [
    auth_1.authMiddleware,
    admin_1.adminMiddleware,
    (0, express_validator_1.param)('id').isInt(),
    (0, express_validator_1.body)('question_text').notEmpty(),
    (0, express_validator_1.body)('options').isArray({ min: 4, max: 4 }),
    (0, express_validator_1.body)('correct_option').isInt({ min: 0, max: 3 }),
], (0, timeOutMid_1.retryTimeoutMiddleware)({ requestTimeout: 15000 })(questions_1.updateQuestion));
router.delete('/:id', [auth_1.authMiddleware, admin_1.adminMiddleware, (0, express_validator_1.param)('id').isInt()], (0, timeOutMid_1.retryTimeoutMiddleware)({ requestTimeout: 15000 })(questions_1.deleteQuestion));
exports.default = router;
