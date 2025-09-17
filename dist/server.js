"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const questions_1 = __importDefault(require("./routes/questions"));
const quiz_1 = __importDefault(require("./routes/quiz"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' })); // Update with Vercel URL later
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/questions', questions_1.default);
app.use('/api/quiz', quiz_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
