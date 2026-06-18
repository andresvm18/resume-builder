# ResumeBuilder 🚀

[![CI](https://github.com/andresvm18/resume-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/andresvm18/resume-builder/actions/workflows/ci.yml)

AI-powered ATS resume builder. Users maintain a reusable career profile,
paste a job description, and get a tailored, ATS-optimized resume rendered
to a professional PDF with keyword analysis, AI rewriting, and an ATS
score along the way.

For the feature-by-feature history of how the project got here, see
[CHANGELOG.md](./CHANGELOG.md).

---

## ✨ Core features

- **Resume builder** — guided multi-step flow (personal info, summary,
  experience, education, skills, languages, projects) with live preview.
- **Career profiles** — a persistent professional profile that can generate
  a tailored resume directly from a job description, instead of rebuilding
  one from scratch every time.
- **ATS analysis** — keyword extraction, resume/job-description matching,
  and a weighted ATS compatibility score with actionable recommendations.
- **AI optimization** — summary rewriting, full-resume optimization, and a
  final ATS scoring pass, backed by a multi-provider AI fallback chain
  (OpenRouter → Gemini → OpenAI) so a single provider outage doesn't break
  the feature.
- **PDF generation** — server-side LaTeX rendering (`pdflatex`) across three
  templates (classic, modern, compact), with empty sections automatically
  omitted.
- **Resume management** — versioned resumes per user, duplication, editing,
  and metadata (target role / target company) for organizing applications.
- **Auth** — JWT-based registration/login with rate limiting on auth
  endpoints.

---

## 🛠 Tech stack

| Layer    | Stack |
|----------|-------|
| Frontend | React 19, TypeScript, Vite, React Router, React Hook Form, Zustand, Tailwind |
| Backend  | Node.js, Express 5, Prisma ORM, PostgreSQL, JWT |
| AI       | OpenRouter, Gemini, OpenAI (fallback chain) |
| PDF      | LaTeX (`pdflatex`) |
| Observability | Sentry (frontend + backend), structured JSON logging, `/api/health` |
| DevOps   | Docker, Docker Compose, GitHub Actions CI |

---

## 📂 Project structure

```txt
apps/
├── api/                         # Backend (Express + Prisma)
│   ├── prisma/                  # Schema and migrations
│   ├── src/
│   │   ├── config/              # env, jwt, sentry
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # auth, security, sanitize, errors, logging
│   │   ├── routes/              # Route definitions per resource
│   │   ├── services/
│   │   │   ├── ai/              # Providers, prompts, parsing/normalizing
│   │   │   ├── resume/          # LaTeX rendering, repository, mapping
│   │   │   └── system/          # Health checks
│   │   ├── templates/resume/    # .tex templates (classic/modern/compact)
│   │   ├── utils/                # Error helpers, logger, normalizers
│   │   └── validators/          # Zod schemas
│   └── src/__tests__/           # Jest + Supertest, against a real test DB
└── web/                          # Frontend (React + Vite)
    └── src/
        ├── app/router/           # Route definitions
        ├── modules/              # Feature-based: auth, dashboard, landing,
        │                         # profile, resume-builder
        └── shared/               # Reusable components, context, services,
                                   # config, styles
```

---

## ⚙️ Getting started

### 1. Clone and install

```bash
git clone https://github.com/andresvm18/resume-builder.git
cd resume-builder
npm run install:all
```

### 2. Configure environment variables

**`apps/api/.env`**

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/resume_builder"
JWT_SECRET="a-long-random-string"        # required; must be ≥32 chars in production
PORT=8080
FRONTEND_URL="http://localhost:5173"     # required in production (used for CORS + CSP)

# At least one AI provider key is needed for the AI features to work:
GEMINI_API_KEY=
OPENROUTER_API_KEY=
OPENAI_API_KEY=

SENTRY_DSN_BACKEND=                       # optional
```

**`apps/web/.env`**

```env
VITE_API_URL=http://localhost:8080/api
VITE_SENTRY_DSN=                          # optional
```

### 3. Set up the database

```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
cd ../..
```

PDF generation also requires a local `pdflatex` install (e.g. a TeX Live
distribution) unless you're running through Docker, which already includes
it.

### 4. Run it

```bash
npm run dev:api    # http://localhost:8080
npm run dev:web    # http://localhost:5173
```

---

## 🐳 Docker setup

```bash
cp apps/api/.env.example apps/api/.env
```

Fill in `apps/api/.env` with at least `JWT_SECRET` and one AI provider key.
You can leave `DATABASE_URL` as-is — `docker-compose.yml` overrides it so
the API talks to the bundled PostgreSQL service instead of localhost.

```bash
docker compose up --build
```

| Service    | URL                         |
|------------|------------------------------|
| `web`      | http://localhost:5173        |
| `api`      | http://localhost:8080        |
| `postgres` | localhost:5432                |

---

## 🧪 Testing, linting & typechecking

```bash
npm test          # backend (Jest + Supertest) and frontend (Vitest) suites
npm run lint       # ESLint for both apps/api and apps/web
npm run typecheck:web
npm run build:web
```

The API tests run against a real PostgreSQL database — set `DATABASE_URL`
in `apps/api/.env.test` to point at a database with `_test` in its name
(the test bootstrap refuses to run against anything else).

---

## 📡 API reference

All endpoints are mounted under `/api`. Endpoints marked 🔒 require an
`Authorization: Bearer <token>` header.

**Auth** (`/auth`)
- `POST /register`
- `POST /login`
- `GET /me` 🔒

**Resumes** (`/resume`) — all 🔒
- `POST /generate` — create a resume and return its PDF
- `GET /` — list the current user's resumes
- `GET /:id` — get one resume (latest version)
- `GET /:id/download` — re-render and download a resume's PDF
- `PUT /:id` — update a resume (creates a new version)
- `POST /:id/duplicate`
- `DELETE /:id`

**AI** (`/ai`) — all 🔒, rate-limited
- `POST /optimize-summary`
- `POST /recommendations`
- `POST /optimize-resume`
- `POST /final-ats-analysis`

**Career profile** (`/profile`) — all 🔒
- `GET /`
- `PUT /`
- `POST /generate-resume` — generate a tailored resume from the profile + a job description

**Health**
- `GET /health` — public; reports database, AI provider configuration, and memory status

---

## 🔒 Security

- JWT auth with bcrypt password hashing and Zod-validated strong passwords
- Per-route rate limiting (stricter on `/auth` and `/ai`)
- Helmet security headers + a production CSP
- Request body sanitization (HTML/script stripping) on all inputs
- Production-safe error responses (no stack traces or internal details leaked)
- `pdflatex` invoked via `execFile` (argument array, not a shell string) to avoid command injection

---

## 📊 Observability

- Structured JSON logging with request IDs, scoped by subsystem, with secrets redacted automatically
- `/api/health` for database, AI provider, and memory diagnostics
- Sentry on both frontend and backend (opt-in via `SENTRY_DSN_BACKEND` / `VITE_SENTRY_DSN`)


---

## 📬 Contact

Andrés Víquez — [LinkedIn](https://www.linkedin.com/in/andr%C3%A9s-v%C3%ADquez-marchena-b39490310/) · viquezandres1811@gmail.com