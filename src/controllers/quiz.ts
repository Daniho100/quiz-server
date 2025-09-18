// import { Request, Response } from 'express';
// import pool from '../utils/db';

// export const startQuiz = async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query('SELECT * FROM questions');
//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const submitQuiz = async (req: Request, res: Response) => {
//   try {
//     const answers = req.body; // { questionId: selectedOption }
//     const result = await pool.query('SELECT id, correct_option FROM questions');
//     let score = 0;
//     let correctCount = 0;

//     result.rows.forEach((question) => {
//       if (answers[question.id] === question.correct_option) {
//         score += 1;
//         correctCount += 1;
//       }
//     });

//     res.json({
//       totalScore: score,
//       correctAnswers: correctCount,
//       totalQuestions: result.rows.length,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };





import { Request, Response } from 'express';
import retry from 'async-retry';
import pool from '../utils/db';

export const startQuiz = async (req: Request, res: Response) => {
  try {
    const questions = await retry(async () => {
      const { rows } = await pool.query(
        'SELECT * FROM questions ORDER BY RANDOM() LIMIT 10'
      );
      if (!rows.length) throw new Error('No questions found');
      return rows;
    }, { retries: 3, minTimeout: 1000 });

    res.json(questions);
  } catch (error: any) {
    console.error('❌ startQuiz error:', error);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};



export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const answers = req.body; // { questionId: selectedOption }
    const result = await pool.query('SELECT id, correct_option FROM questions');
    let score = 0;
    let correctCount = 0;

    result.rows.forEach((question) => {
      if (answers[question.id] === question.correct_option) {
        score += 1;
        correctCount += 1;
      }
    },{ retries: 3, minTimeout: 1000 });

    res.json({
      totalScore: score,
      correctAnswers: correctCount,
      totalQuestions: result.rows.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
