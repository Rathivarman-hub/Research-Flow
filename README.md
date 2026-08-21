# 🔬 ResearchFlow AI — Research Software Engineering Assistant

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20API-4285F4?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap%205.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**ResearchFlow** is a comprehensive full-stack platform designed to help researchers, scientists, and students adopt **Research Software Engineering (RSE)** best practices. It bridges the gap between academic code and production-grade engineering standards through automated code assessment, AI-driven mentorship, reproducibility auditing, and team collaboration.

---

## 🌟 Key Features

### 1. 📊 RSE Maturity & Quality Assessment
- Evaluates codebases across modularity, documentation, automated testing, version control, and reproducibility.
- Automated tiered grading system: **Bronze**, **Silver**, **Gold**, and **Platinum** maturity levels.
- Actionable AI-generated improvement checklists and refactoring suggestions.

### 2. 🤖 AI Research Mentor & Floating Assistant
- Interactive AI chat powered by **Google Gemini AI** (`@google/generative-ai`).
- Contextual assistance for debugging scientific code, generating documentation, structuring experiments, and packaging research software.
- Persistent floating chat bubble accessible across all dashboard pages.

### 3. 📋 Collaborative Workspace & Kanban Board
- Drag-and-drop Kanban task management (To Do, In Progress, Under Review, Completed).
- Team collaboration, activity logging, and real-time in-app notification center.

### 4. 🔄 Reproducibility & Notebook Validator
- Validates Jupyter notebooks (`.ipynb`), execution order, dependencies, and environment files (`requirements.txt`, `environment.yml`).
- Generates reproducibility health reports and highlights non-deterministic risks.

### 5. 📈 Visual Analytics & Metrics Dashboard
- Dynamic radar charts, bar charts, and historical progress tracking powered by **Chart.js** & **react-chartjs-2**.
- Deep-dive metrics on code health, test coverage, and documentation completeness.

### 6. 🎓 Scholar Profile & Official RSE Certification
- Scholar profile displaying unlocked badges, stats, and real avatar photo uploads with Multer.
- Dynamic **Certificate of Achievement** generator with PDF export / print functionality for projects reaching Gold (71+) and Platinum (91+) tiers.

### 7. 🌓 Dark & Light Mode
- Complete theme toggling with curated color palettes, accessible contrast, and glassmorphic card design.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router DOM 7, React Bootstrap 5.3, Lucide React, Chart.js, Framer Motion |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB with Mongoose ODM |
| **AI Integration** | Google Gemini API (`@google/generative-ai`) |
| **Utilities** | Multer (file uploads), PDFKit (PDF generation), Adm-Zip (repo extraction), BcryptJS, JWT |

---

## 📁 Project Structure

```
final/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets and icons
│   ├── src/
│   │   ├── assets/             # Images and logos
│   │   ├── components/         # Reusable UI components (Navbar, Sidebar, ChatBot, UserAvatar, etc.)
│   │   ├── context/            # Authentication and Global State Context
│   │   ├── pages/              # Application views (Dashboard, Projects, AssessmentReports, etc.)
│   │   ├── services/           # Axios API services and endpoints
│   │   ├── App.jsx             # Route definitions and layout wrapper
│   │   ├── index.css           # Design tokens, theme variables, and custom styling
│   │   └── main.jsx            # Application entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vercel.json             # Vercel deployment rewrites
│   └── vite.config.js          # Vite build configuration
│
└── server/                     # Backend Application (Node.js + Express)
    ├── config/                 # MongoDB database connection
    ├── controllers/            # API request handlers (AI, Projects, Tasks, Auth, etc.)
    ├── middleware/             # JWT Authentication and Multer upload middleware
    ├── models/                 # Mongoose database schemas
    ├── routes/                 # Express API routes
    ├── uploads/                # User uploaded assets and avatars
    ├── package.json            # Backend dependencies
    └── server.js               # Express application entry point
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
- [Google Gemini API Key](https://aistudio.google.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Rathivarman-hub/final.git
cd final
```

---

### 2. Backend Setup (`server/`)
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend development server:
```bash
npm run dev
```
> Backend will be running at `http://localhost:5000`

---

### 3. Frontend Setup (`client/`)
```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```
> Frontend will be running at `http://localhost:5173`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new scholar account |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Fetch authenticated user details |
| `POST` | `/api/auth/upload-avatar` | Upload profile photo (Multer) |
| `GET` | `/api/projects` | List all user research projects |
| `POST` | `/api/projects` | Create a new research project |
| `POST` | `/api/assessments/assess` | Trigger automated RSE maturity evaluation |
| `POST` | `/api/ai/ask` | Query AI Research Mentor |
| `POST` | `/api/reproducibility/check` | Analyze notebook and dependency reproducibility |
| `GET` | `/api/tasks` | Get project Kanban tasks |
| `POST` | `/api/tasks` | Create / update project Kanban tasks |
| `GET` | `/api/analytics` | Retrieve quality metrics and scoring trends |
| `GET` | `/api/collaboration/notifications` | Fetch unread user notifications |

---

## 🚢 Deployment

- **Frontend**: Ready for deployment on [Vercel](https://vercel.com/) with SPA rewrites configured in [`client/vercel.json`](client/vercel.json).
- **Backend**: Ready for deployment on [Render](https://render.com/) or [Railway](https://railway.app/).

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
