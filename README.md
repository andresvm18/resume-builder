# ResumeBuilder 🚀

AI-powered ATS Resume Builder focused on generating optimized, professional, and production-ready resumes tailored to job descriptions.

---

# ✨ Current Phase

## Phase 6 — Production Readiness & Security

ResumeBuilder now includes:
- ATS resume optimization
- AI-powered resume rewriting
- multi-provider AI fallback
- PDF generation
- structured logging
- Sentry monitoring
- Dockerized local environments
- security hardening
- CI/CD validation
- production-ready backend architecture

---

# 🧠 Core Features

## Resume Builder
- Multi-step resume creation flow
- Live resume preview
- ATS-oriented structure
- Real-time editing

## AI Resume Optimization
- Resume rewriting with AI
- Industry-agnostic optimization
- ATS-focused recommendations
- Humanized resume improvements
- Structured AI normalization

## ATS Analysis
- Keyword extraction
- ATS compatibility scoring
- Resume/job description matching
- Completeness analysis

## PDF Generation
- Professional PDF export
- LaTeX-based rendering
- ATS-friendly layouts
- Stable rendering pipeline

---

# 🤖 AI Architecture

ResumeBuilder uses a multi-provider AI fallback system:

1. OpenRouter
2. Gemini
3. OpenAI

Benefits:
- improved reliability
- reduced provider dependency
- safer fallback behavior
- better uptime

---

# 📊 Monitoring & Observability

## Structured Logging
- centralized backend logger
- request-aware diagnostics
- scoped logging architecture

## Health Monitoring
Endpoint:

```txt
/api/health
```

Includes:
- database status
- AI provider availability
- memory diagnostics
- uptime reporting

## Sentry Monitoring
### Backend
- Express exception tracking
- runtime diagnostics

### Frontend
- React runtime error tracking
- production monitoring support

---

# 🔒 Security Features

- Strong password validation
- Request sanitization
- XSS mitigation
- CSP (Content Security Policy)
- Helmet security headers
- Auth-specific rate limiting
- Safer production error handling
- Environment validation safety

---

# 🐳 Docker Setup

ResumeBuilder includes a local containerized development environment.

## Run locally

```bash
docker compose up --build
```

Services:
- frontend
- backend
- PostgreSQL

---

# ⚙ CI/CD

GitHub Actions pipeline includes:
- backend tests
- frontend tests
- frontend lint validation
- production build verification
- dependency auditing

---

# 🛠 Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Zustand
- React Hook Form
- React Router

## Backend
- Node.js
- Express
- Prisma
- PostgreSQL
- JWT Authentication

## AI
- OpenRouter
- Gemini
- OpenAI

## DevOps
- Docker
- Docker Compose
- GitHub Actions
- Sentry

---

# 🧱 Architecture

## Frontend
```txt
apps/web
```

## Backend
```txt
apps/api
```

## Database
```txt
PostgreSQL + Prisma ORM
```

---

# 🚀 Future Improvements

- AI-generated cover letters
- Resume analytics
- AI interview preparation
- LinkedIn import
- Public resume sharing
- Career dashboard

---

# 📌 Goal

ResumeBuilder aims to simulate a real-world AI-powered ATS optimization platform while following modern software engineering, DevOps, security, and production-readiness practices.
