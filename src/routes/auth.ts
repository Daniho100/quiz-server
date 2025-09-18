import { Router } from 'express';
import { register, login, updateUserRole } from '../controllers/auth';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { retryTimeoutMiddleware } from '../middleware/timeOutMid';

const router = Router();

router.patch(
  '/:id/role',
  authMiddleware,
  retryTimeoutMiddleware({ requestTimeout: 15000 })(updateUserRole) // 15s timeout
);

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  retryTimeoutMiddleware({ requestTimeout: 15000 })(register) // 15s timeout
);

router.post(
  '/login',
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  retryTimeoutMiddleware({ requestTimeout: 15000 })(login) // 15s timeout
);

export default router;

