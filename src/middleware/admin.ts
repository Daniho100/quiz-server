// middleware/admin.ts
// import { Request, Response, NextFunction } from "express";

// export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const user = (req as any).user; // user is set in authMiddleware

//   if (!user || user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied. Admins only." });
//   }

//   next();
// };





import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    console.log('Admin check failed:', req.user); // debug log
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};
