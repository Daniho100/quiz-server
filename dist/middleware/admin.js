"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        console.log('Admin check failed:', req.user); // debug log
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
