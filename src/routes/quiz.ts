// import { Router } from 'express';
// import { startQuiz, submitQuiz } from '../controllers/quiz';
// import { authMiddleware } from '../middleware/auth';

// const router = Router();

// router.get('/start', authMiddleware, startQuiz);
// router.post('/submit', authMiddleware, submitQuiz);

// export default router;



import { Router } from 'express';
import { startQuiz, submitQuiz } from '../controllers/quiz';
import { authMiddleware } from '../middleware/auth';
import { retryTimeoutMiddleware } from '../middleware/timeOutMid';

const router = Router();

router.get(
  '/start',
  authMiddleware,
  retryTimeoutMiddleware({ requestTimeout: 15000 })(startQuiz) // 15s timeout
);

router.post(
  '/submit',
  authMiddleware,
  retryTimeoutMiddleware({ requestTimeout: 15000 })(submitQuiz) // 15s timeout
);

export default router;
