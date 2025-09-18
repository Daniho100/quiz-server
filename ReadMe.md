# Quiz Application

A full-stack quiz application built with **React**, **Express**, and **PostgreSQL**.

---

## Features
- User authentication (register/login)
- Role-based access (user/admin)
- CRUD operations for questions (admin)
- Quiz interface for users
- JWT-protected API endpoints

---

## Setup Instructions

### Backend
1. Navigate to the `backend` directory:  
   ```bash
   cd backend
Install dependencies:

bash
Copy code
npm install
Create a .env file:

env
Copy code
PORT=5000
DATABASE_URL=your_supabase_postgres_url
JWT_SECRET=your_jwt_secret
Run migrations or import sample-data.sql.

Start the server:

bash
Copy code
npm run dev
Frontend
Navigate to the frontend directory:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Create a .env file:

env
Copy code
VITE_API_URL=http://localhost:5000/api
Start the development server:

bash
Copy code
npm run dev
Database Setup
Create a Supabase project or another PostgreSQL database.

Run the following SQL to create tables:

sql
Copy code
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'user'
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL,
  created_by INTEGER REFERENCES users(id)
);
Import sample data from sample-data.sql.

Deployment
Backend (Render)
Push backend code to GitHub.

Create a Web Service on Render.

Set environment variables (PORT, DATABASE_URL, JWT_SECRET).

Deploy and note the URL.

Frontend (Vercel)
Push frontend code to GitHub.

Create a project on Vercel, connect to repository.

Set VITE_API_URL to your Render backend URL.

Deploy and note the URL.

Demo Credentials
Email: demo@readwriteds.com

Password: demo123

API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and get JWT
GET	/api/questions	Get all questions (protected)
POST	/api/questions	Create a question (admin only)
PUT	/api/questions/:id	Update a question (admin only)
DELETE	/api/questions/:id	Delete a question (admin only)
GET	/api/quiz/start	Start quiz (protected)
POST	/api/quiz/submit	Submit quiz answers (protected)

TypeScript Interfaces
ts
Copy code
export interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_option: number;
  created_by?: number;
}

export interface QuizResult {
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
}