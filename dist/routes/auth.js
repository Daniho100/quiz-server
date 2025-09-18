"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const express_validator_1 = require("express-validator");
const auth_2 = require("../middleware/auth");
const timeOutMid_1 = require("../middleware/timeOutMid");
const router = (0, express_1.Router)();
router.patch('/:id/role', auth_2.authMiddleware, (0, timeOutMid_1.retryTimeoutMiddleware)({ requestTimeout: 15000 })(auth_1.updateUserRole) // 15s timeout
);
router.post("/register", [
    (0, express_validator_1.body)("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    (0, express_validator_1.body)("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], (0, timeOutMid_1.retryTimeoutMiddleware)({ requestTimeout: 15000 })(auth_1.register) // 15s timeout
);
router.post('/login', [
    (0, express_validator_1.body)("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], (0, timeOutMid_1.retryTimeoutMiddleware)({ requestTimeout: 15000 })(auth_1.login) // 15s timeout
);
exports.default = router;
