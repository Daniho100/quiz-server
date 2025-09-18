import { Request, Response } from 'express';
import pool from '../utils/db';
import { validationResult } from 'express-validator';

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query("SELECT * FROM questions");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ getQuestions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const createQuestion = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question_text, options, correct_option } = req.body;

    const result = await pool.query(
      `INSERT INTO questions (question_text, options, correct_option)
       VALUES ($1, $2::jsonb, $3)
       RETURNING *`,
      [question_text, JSON.stringify(options), correct_option]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("❌ createQuestion error:", error);
    res.status(500).json({ message: "Server error", detail: error.message });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  console.log("update logic hit");
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { question_text, options, correct_option } = req.body;

    const result = await pool.query(
      `UPDATE questions
       SET question_text = $1, options = $2::jsonb, correct_option = $3
       WHERE id = $4
       RETURNING *`,
      [question_text, JSON.stringify(options), correct_option, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("❌ updateQuestion error:", error);
    res.status(500).json({ message: "Server error", detail: error.message });
  }
};


export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
   const user = (req as any).user; // bypasses TS checks

    let result;

    if (user.role === 'admin') {
      // Admin can delete any question
      result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
    } else {
      // Normal user can delete only their own questions
      result = await pool.query(
        'DELETE FROM questions WHERE id = $1 AND created_by = $2 RETURNING *',
        [id, user.id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
