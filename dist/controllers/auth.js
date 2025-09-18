"use strict";
// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import pool from '../utils/db';
// import { validationResult } from 'express-validator';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.login = exports.register = void 0;
const async_retry_1 = __importDefault(require("async-retry"));
const db_1 = __importDefault(require("../utils/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// export const register = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = await retry(async () => {
//       const hashed = await bcrypt.hash(password, 10);
//       const { rows } = await pool.query(
//         'INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id, name, email, role',
//         [name, email, hashed, 'user']
//       );
//       if (!rows.length) throw new Error('Failed to create user');
//       return rows[0];
//     }, { retries: 3, minTimeout: 1000 });
//     res.status(201).json({ user });
//   } catch (error: any) {
//     console.error('register error:', error);
//     res.status(500).json({ message: 'Server error', detail: error.message });
//   }
// };
const register = async (req, res) => {
    const client = await db_1.default.connect(); // get a client from the pool
    try {
        const { name, email, password } = req.body;
        const hashed = await bcrypt_1.default.hash(password, 10);
        const { rows } = await client.query('INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id, name, email, role', [name, email, hashed, 'user']);
        if (!rows.length)
            throw new Error('Failed to create user');
        res.status(201).json({ user: rows[0] });
    }
    catch (error) {
        console.error('❌ register error:', error);
        res.status(500).json({ message: 'Server error', detail: error.message });
    }
    finally {
        client.release();
    }
};
exports.register = register;
const login = async (req, res) => {
    const client = await db_1.default.connect();
    try {
        const { email, password } = req.body;
        const user = await (0, async_retry_1.default)(async () => {
            const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (!rows.length)
                throw new Error('Invalid credentials');
            return rows[0];
        }, { retries: 3, minTimeout: 1000 });
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    }
    catch (error) {
        console.error('❌ login error:', error);
        res.status(500).json({ message: 'Server error', detail: error.message });
    }
    finally {
        client.release();
    }
};
exports.login = login;
const updateUserRole = async (req, res) => {
    const client = await db_1.default.connect();
    try {
        const { id } = req.params;
        const { role } = req.body;
        const updatedUser = await (0, async_retry_1.default)(async () => {
            const { rows } = await client.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role', [role, id]);
            if (!rows.length)
                throw new Error('User not found');
            return rows[0];
        }, { retries: 3, minTimeout: 1000 });
        res.json({ user: updatedUser });
    }
    catch (error) {
        console.error('❌ updateUserRole error:', error);
        res.status(500).json({ message: 'Server error', detail: error.message });
    }
    finally {
        client.release();
    }
};
exports.updateUserRole = updateUserRole;
