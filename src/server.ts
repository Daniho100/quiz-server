import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import limiter from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import questionRoutes from './routes/questions';
import quizRoutes from './routes/quiz';
import helmet from 'helmet'
import morgan from 'morgan'
const xss = require('xss-clean');
import mongoSanitize from 'express-mongo-sanitize';



dotenv.config();
const app = express();

app.use(limiter)
const allowedOrigins = ['https://ramos-client.onrender.com'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);

app.use(helmet({contentSecurityPolicy: false,}));
app.use(morgan('dev'))
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quiz', quizRoutes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));