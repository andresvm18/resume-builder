# ResumeBuilder 🚀

**AI-powered resume optimization platform with ATS analysis, intelligent recommendations, and professional PDF generation.**

ResumeBuilder helps users create modern, ATS-friendly resumes while leveraging Generative AI to optimize content, improve keyword alignment, and enhance professional presentation.

---

## ✨ Features

### 📄 Resume Builder
- Multi-step resume creation workflow
- Structured professional data input
- Real-time editing experience
- Resume persistence and versioning

### 🤖 AI-Powered Optimization
- Professional summary generation
- Experience rewriting into achievement-oriented bullet points
- Semantic ATS optimization
- Context-aware resume enhancement
- Intelligent recommendations based on job descriptions

### 🔍 ATS Analysis Engine
- Keyword extraction
- Resume-job matching
- ATS compatibility scoring
- Missing keyword detection
- Actionable optimization recommendations

### 📑 PDF Generation
- Professional ATS-friendly templates
- High-quality PDF export using LaTeX
- Resume preview before download
- Optimized formatting for recruiters and ATS systems

### 🔐 Authentication & Dashboard
- JWT authentication
- Protected routes
- User dashboard
- Resume management system

---

# 🧠 AI Architecture

ResumeBuilder uses a resilient multi-provider AI fallback system:

```txt
OpenRouter → Gemini → OpenAI
```

If one provider becomes unavailable, the system automatically falls back to the next provider to maintain reliability and uptime.

The platform also includes:
- prompt injection protection
- sanitization pipelines
- structured AI parsing
- safe fallback behavior

---

# 🏗 Tech Stack

## Frontend
- React
- TypeScript
- Vite
- React Router
- Vitest
- React Testing Library

## Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

## AI Providers
- OpenRouter
- Google Gemini
- OpenAI

## PDF Generation
- LaTeX (pdflatex)

## DevOps & Tooling
- GitHub Actions CI/CD
- ESLint
- Prettier
- Jest
- Supertest

---

# 📸 Screenshots

> Add screenshots or GIFs here before publishing.

Suggested sections:
- Landing Page
- Resume Builder
- ATS Analysis
- AI Optimization
- PDF Preview
- Dashboard

---

# 📂 Monorepo Structure

```txt
/apps
├── api        # Express + Prisma backend
└── web        # React + TypeScript frontend
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/andresvm18/resume-builder.git
cd resume-builder
```

---

## 2. Install dependencies

### Backend

```bash
cd apps/api
npm install
```

### Frontend

```bash
cd ../web
npm install
```

---

# ⚙ Environment Variables

## Backend (`apps/api/.env`)

```env
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
```

---

# 🧪 Running the Project

## Backend

```bash
cd apps/api
npm run dev
```

## Frontend

```bash
cd apps/web
npm run dev
```

---

# 🧪 Testing

## Backend Tests

```bash
cd apps/api
npm test
```

## Frontend Tests

```bash
cd apps/web
npm test
```

---

# 🔐 Security

ResumeBuilder includes multiple security layers:

- Helmet security headers
- API rate limiting
- Authentication rate limiting
- XSS sanitization
- Prompt injection guardrails
- Secure JWT handling
- Request payload limits
- Isolated test environments

---

# 📈 Project Evolution

## ✅ Phase 1 — MVP
- Resume builder
- PDF generation
- Authentication
- Dashboard
- Resume CRUD

## ✅ Phase 2 — ATS Optimization
- ATS analysis engine
- Keyword extraction
- Matching engine
- ATS scoring
- Recommendation system

## ✅ Phase 3 — AI Optimization
- Generative AI workflows
- AI-powered resume enhancement
- Multi-provider AI architecture
- Resume sanitization pipeline
- Advanced UX improvements
- Security hardening

## ✅ Phase 4 — Advanced PDF & UX Enhancements
- Multiple LaTeX resume templates
- Dynamic PDF section rendering
- Template selection system
- Improved skills UX
- Cleaner ATS-friendly PDF generation
- Advanced customization support

---

# 🚧 Future Roadmap

## Phase 5 — Career Intelligence Platform

Planned features include:

- Persistent user career profiles
- AI-powered profile-to-resume generation
- AI-generated cover letters
- Resume version comparison
- Advanced personalization workflows
- Career analytics dashboard
- Public resume sharing
- Intelligent resume recommendations

---

# 👨‍💻 Author

## Andrés Víquez

Software Engineer focused on:
- Full Stack Development
- AI-powered applications
- Backend architecture

GitHub: https://github.com/andresvm18

---

# ⭐ Final Notes

ResumeBuilder evolved from a simple resume generator into a production-oriented AI-powered career optimization platform capable of:

- generating professional resumes
- optimizing ATS compatibility
- improving resume quality with AI
- delivering recruiter-friendly PDF exports
- helping users improve competitiveness in modern hiring systems