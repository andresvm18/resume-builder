# ResumeBuilder 🚀

**AI-powered ATS resume platform with intelligent resume generation, career profiles, ATS optimization, and professional PDF export workflows.**

ResumeBuilder helps users create, optimize, organize, and manage professional resumes using AI-assisted workflows, ATS-focused optimization strategies, and modern SaaS-style editing experiences.

The platform evolved from a traditional resume generator into a production-oriented AI-powered career platform.

---

# ✨ Features

## 📄 Resume Builder
- Multi-step resume creation workflow
- Structured professional data input
- Real-time editing experience
- Resume persistence and versioning
- Autosave workflows
- Resume duplication support
- Resume metadata management
- Responsive editing experience

---

## 👤 Career Profile System
- Persistent professional profiles
- Reusable professional identity
- Skills, projects, education, and experience persistence
- Centralized profile-based workflows
- AI-ready career data structure

---

## 🤖 AI-Powered Resume Generation
- Generate resumes directly from Career Profiles
- ATS-oriented AI resume generation
- Intelligent experience selection
- Context-aware summary generation
- Resume tailoring based on job descriptions
- Semantic optimization for ATS systems
- Achievement-oriented resume rewriting
- Structured resume hydration into ResumeBuilder

---

## 🔍 ATS Optimization Engine
- Keyword extraction
- Resume-job matching
- ATS compatibility scoring
- Missing keyword detection
- ATS-focused recommendations
- Keyword-aware optimization workflows
- Intelligent targeting support

---

## 📋 Resume Management System
Users can:
- duplicate resumes
- organize resumes by target role/company
- manage multiple resume variants
- edit existing resumes
- download ATS-friendly PDFs

Resume metadata includes:
- target role
- target company

Examples:
- Frontend Developer
- QA Engineer
- Roche
- Align Technology

---

## 🌙 Modern UX Features
- Dark mode support
- Responsive layouts
- Skeleton loading states
- Modern dashboard workflows
- Search & sorting
- Save-state indicators
- Accessible UI patterns
- Unified design system using Tabler Icons

---

## 📑 PDF Generation
- Professional ATS-friendly templates
- High-quality PDF export using LaTeX
- Resume preview before download
- Dynamic section rendering
- ATS-optimized formatting
- Template selection system

---

## 🔐 Authentication & Dashboard
- JWT authentication
- Protected routes
- User dashboard
- Resume organization workflows
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
- malformed response handling
- normalization pipelines

---

# 🏗 Tech Stack

## Frontend
- React
- TypeScript
- Vite
- React Router
- Context API
- Tabler Icons
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
- AI Resume Generation
- Dashboard
- Career Profiles
- Dark Mode
- PDF Preview

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
- Deployment workflows
- CI/CD improvements

## ✅ Phase 5 — Career Platform & Resume Management
- Career Profiles
- AI-generated resumes from profile data
- Resume metadata management
- Resume duplication
- Autosave workflows
- Dashboard search & sorting
- Dark mode support
- Responsive UX polish
- Unified design system
- Improved editing workflows
- Save-state indicators
- Dashboard organization improvements

---

# 🚧 Future Roadmap

## Planned Features

- AI-generated cover letters
- Production monitoring
- Deployment hardening

---

# 👨‍💻 Author

## Andrés Víquez

Software Engineer focused on:
- Full Stack Development
- AI-powered applications
- Backend architecture

GitHub:
https://github.com/andresvm18

---

# ⭐ Final Notes

ResumeBuilder evolved from a simple resume generator into a production-oriented AI-powered career platform capable of:

- generating professional resumes
- optimizing ATS compatibility
- organizing multiple resume variants
- improving resume quality with AI
- generating recruiter-friendly PDF exports
- supporting reusable career workflows
- delivering SaaS-style editing experiences

The platform now behaves much more like a real-world AI SaaS product instead of a static resume generator.
