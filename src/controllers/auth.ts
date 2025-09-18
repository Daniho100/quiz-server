// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import pool from '../utils/db';
// import { validationResult } from 'express-validator';

// export const register = async (req: Request, res: Response) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, email, password } = req.body;

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // insert name, email, password, role
//     const result = await pool.query(
//       `INSERT INTO users (name, email, password, role)
//        VALUES ($1, $2, $3, $4)
//        RETURNING id, name, email, role`,
//       [name, email, hashedPassword, 'user'] // default role = user
//     );

//     // sign JWT
//     const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, process.env.JWT_SECRET!, {
//       expiresIn: '1h',
//     });

//     res.status(201).json({ token, user: result.rows[0] });
//     console.log('✅ user registered successfully');
//   } catch (error) {
//     console.error('❌ register error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// export const login = async (req: Request, res: Response) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;
//     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const user = result.rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
//       expiresIn: '1h',
//     });

//     // return user info including role
//     res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error('❌ login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const updateUserRole = async (req: Request, res: Response) => {
//   try {
//     const { role } = req.body; // expected: "admin" or "user"
//     const { id } = req.params;

//     if (!['user', 'admin'].includes(role)) {
//       return res.status(400).json({ message: 'Invalid role' });
//     }

//     const result = await pool.query(
//       `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role`,
//       [role, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'Role updated successfully', user: result.rows[0] });
//   } catch (error) {
//     console.error('❌ updateUserRole error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };






import { Request, Response } from 'express';
import retry from 'async-retry';
import pool from '../utils/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await retry(async () => {
      const hashed = await bcrypt.hash(password, 10);
      const { rows } = await pool.query(
        'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email',
        [name, email, hashed, 'user']
      );
      if (!rows.length) throw new Error('Failed to create user');
      return rows[0];
    }, { retries: 3, minTimeout: 1000 });

    res.status(201).json({ user });
  } catch (error: any) {
    console.error('❌ register error:', error);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await retry(async () => {
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (!rows.length) throw new Error('Invalid credentials');
      return rows[0];
    }, { retries: 3, minTimeout: 1000 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error: any) {
    console.error('❌ login error:', error);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await retry(async () => {
      const { rows } = await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
        [role, id]
      );
      if (!rows.length) throw new Error('User not found');
      return rows[0];
    }, { retries: 3, minTimeout: 1000 });

    res.json({ user: updatedUser });
  } catch (error: any) {
    console.error('❌ updateUserRole error:', error);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};
