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





import { Router } from 'express';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questions';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import { body, param } from 'express-validator';
import { retryTimeoutMiddleware } from '../middleware/timeOutMid';

const router = Router();

router.get(
  '/',
  authMiddleware,
  retryTimeoutMiddleware({ requestTimeout: 15000 })(getQuestions) // 15s timeout
);

router.post(
  '/',
  [
    authMiddleware,
    adminMiddleware,
    body('question_text').notEmpty(),
    body('options').isArray({ min: 4, max: 4 }),
    body('correct_option').isInt({ min: 0, max: 3 }),
  ],
  retryTimeoutMiddleware({ requestTimeout: 15000 })(createQuestion)
);

router.put(
  '/:id',
  [
    authMiddleware,
    adminMiddleware,
    param('id').isInt(),
    body('question_text').notEmpty(),
    body('options').isArray({ min: 4, max: 4 }),
    body('correct_option').isInt({ min: 0, max: 3 }),
  ],
  retryTimeoutMiddleware({ requestTimeout: 15000 })(updateQuestion)
);

router.delete(
  '/:id',
  [authMiddleware, adminMiddleware, param('id').isInt()],
  retryTimeoutMiddleware({ requestTimeout: 15000 })(deleteQuestion)
);

export default router;
