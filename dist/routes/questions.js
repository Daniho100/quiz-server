"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questions_1 = require("../controllers/questions");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, questions_1.getQuestions);
router.post('/', [
    auth_1.authMiddleware,
    (0, express_validator_1.body)('question_text').notEmpty(),
    (0, express_validator_1.body)('options').isArray({ min: 4, max: 4 }),
    (0, express_validator_1.body)('correct_option').isInt({ min: 0, max: 3 }),
], questions_1.createQuestion);
router.put('/:id', [
    auth_1.authMiddleware,
    (0, express_validator_1.param)('id').isInt(),
    (0, express_validator_1.body)('question_text').notEmpty(),
    (0, express_validator_1.body)('options').isArray({ min: 4, max: 4 }),
    (0, express_validator_1.body)('correct_option').isInt({ min: 0, max: 3 }),
], questions_1.updateQuestion);
router.delete('/:id', [auth_1.authMiddleware, (0, express_validator_1.param)('id').isInt()], questions_1.deleteQuestion);
exports.default = router;
