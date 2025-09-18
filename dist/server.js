"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const rateLimiter_1 = __importDefault(require("./middleware/rateLimiter"));
const auth_1 = __importDefault(require("./routes/auth"));
const questions_1 = __importDefault(require("./routes/questions"));
const quiz_1 = __importDefault(require("./routes/quiz"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// import mongoSanitize from 'express-mongo-sanitize';
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(rateLimiter_1.default);
app.use((0, cors_1.default)());
const allowedOrigins = ["https://readwrite-quiz-client.onrender.com"];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
app.options("/*all", (0, cors_1.default)());
app.use((0, helmet_1.default)({ contentSecurityPolicy: false, }));
app.use((0, morgan_1.default)('dev'));
// app.use(mongoSanitize());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/questions', questions_1.default);
app.use('/api/quiz', quiz_1.default);
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
