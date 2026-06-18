# Changelog

This project was built in phases. This file keeps that history in one
place instead of spread across separate `README_PhaseN.md` files.

## Phase 6 — Production readiness & security

- Centralized structured JSON logging with request IDs and automatic
  secret redaction.
- `/api/health` endpoint reporting database, AI provider, and memory status.
- Sentry integration on both frontend and backend.
- Security hardening: stronger password validation, request sanitization,
  CSP via Helmet, auth-specific rate limiting, production-safe error
  responses, stricter `JWT_SECRET` requirements in production.
- Dockerized local environment (API + web + Postgres via Docker Compose).
- CI: frontend lint validation, build verification, dependency auditing.
- Frontend: shared async-action patterns, centralized app messages,
  reduced duplicated loading/error-handling logic.

## Phase 5 — Career platform & resume management

- Persistent **career profiles** (personal info, summary, education,
  experience, skills, languages, projects) as a reusable source for AI
  resume generation.
- AI resume generation pipeline: career profile + job description →
  tailored, ATS-optimized resume, loaded into the builder for review.
- Resume metadata (target role / target company) and dashboard badges.
- Resume duplication from the dashboard.
- Autosave for the builder and the career profile (debounced, with
  save-state indicators).
- Dark mode (`ThemeProvider`, CSS variable theming, persisted preference).
- Dashboard search/sort and skeleton loading states.
- New endpoints: `GET/PUT /api/profile`, `POST /api/profile/generate-resume`,
  `PUT /api/resume/:id`, `POST /api/resume/:id/duplicate`.

## Phase 4 — Templates & PDF UX

- Three selectable LaTeX resume templates: classic, modern, compact.
- Dynamic section rendering — empty sections (e.g. no projects) are
  omitted from the generated PDF instead of rendering blank.
- Comma-separated skills input with automatic trimming and de-duplication.
- Template selector UI integrated into the resume builder flow.

## Phase 3 — AI optimization

- `POST /api/ai/optimize-resume` — full resume rewrite against a job
  description (summary, experience bullets, skills) while preserving
  personal data and not inventing experience.
- `POST /api/ai/recommendations` — structured keyword extraction
  (technical, soft skills, certifications, responsibilities) plus
  matched/missing keywords and actionable suggestions.
- Multi-provider AI fallback chain: OpenRouter → Gemini → OpenAI, so a
  single provider outage or quota limit doesn't break the feature.
- Structured AI response parsing/normalization and sanitization before
  the result is used to render a PDF.
- Prompt-level safety constraints against hallucinated experience,
  skills, or certifications, and against prompt injection from resume
  or job-description content.

## Phase 2 — ATS optimization

- Job description input step in the resume builder.
- Heuristic keyword extraction (normalization, stopword filtering,
  n-grams, frequency ranking) — no AI provider required for this layer.
- Resume/job-description matching engine with flexible (non-exact)
  token comparison.
- Weighted ATS score: keyword match (40%), section completeness (20%),
  format quality (20%), role alignment (20%).
- Recommendation engine surfacing missing keywords and weak sections.
- ATS analysis panel in the UI showing the score breakdown and keywords.

## Phase 1 — MVP

- Multi-step resume builder (personal info, summary, experience,
  education, skills, languages, projects).
- Server-side LaTeX → PDF rendering.
- JWT authentication (register/login) with protected routes on both
  frontend and backend.
- PostgreSQL + Prisma persistence, with resume versioning and
  per-user data isolation.
- Dashboard: list, edit, download, and delete resumes.