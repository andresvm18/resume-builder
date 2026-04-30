# ResumeBuilder 🚀

A full-stack web application for creating, optimizing, and managing professional resumes tailored for Applicant Tracking Systems (ATS).

---

## ✨ Overview

ResumeBuilder is a modern SaaS-style application that allows users to:

- Create structured resumes through a guided multi-step builder
- Generate professional PDFs using LaTeX
- Save and manage multiple resume versions
- Edit, download, and delete resumes
- Authenticate securely with JWT
- Persist data using a PostgreSQL database

This project was built as a **production-oriented MVP**, focusing on clean architecture, scalability, and real-world features.

---

## 🧠 Key Features

### 📝 Resume Builder
- Multi-step form (Personal, Summary, Experience, Education, Skills, Languages, Projects)
- Real-time state management
- Local draft persistence (when creating new resumes)

### 📄 PDF Generation
- Server-side LaTeX rendering
- Clean, ATS-friendly resume templates
- Automatic download + preview

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes (frontend + backend)

### 🗄 Data Persistence
- PostgreSQL + Prisma ORM
- Resume versioning system
- User-specific data isolation

### 📊 Dashboard
- View all saved resumes
- Edit existing resumes
- Download resumes on demand
- Delete resumes with confirmation
- Dynamic stats (no mock data)

---

## 🏗 Tech Stack

### Frontend
- React + TypeScript
- React Router
- Custom hooks for state management
- Modular architecture (feature-based)

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Other
- LaTeX (pdflatex) for PDF generation
- REST API architecture

---

## 📂 Project Structure
~~~
## 📂 Project Structure
/apps
├── /api                          # Backend application (Node.js)
│   ├── /prisma                   # Database schema and migrations (Prisma ORM)
│   ├── /src
│   │   ├── /controllers          # Request handlers and response logic
│   │   ├── /lib                  # Shared utilities and third-party configurations
│   │   ├── /middleware           # Custom request-response cycle functions
│   │   ├── /routes               # API endpoint definitions
│   │   ├── /services             # Core business logic and DB interactions
│   │   ├── /templates            # Document or email templates
│   │   └── index.js              # Server entry point
│   ├── .env                      # Environment variables
│   └── prisma.config.ts          # Prisma client configuration
└── /web                          # Frontend application (React + TS)
    ├── /public                   # Static assets
    ├── /src
    │   ├── /app/router           # Routing logic and path definitions
    │   ├── /modules              # Feature-based architecture
    │   │   ├── /auth             # Login, signup, and session management
    │   │   ├── /dashboard        # Main user interface and data views
    │   │   ├── /landing          # Public marketing and home pages
    │   │   └── /resume-builder   # Core tool for creating/editing resumes
    │   ├── /shared               # Reusable UI components and global styles
    │   └── main.tsx              # Application entry point
    ├── eslint.config.js          # Linting rules
    └── index.html                # Base HTML template
~~~



## ⚙️ Installation & Setup

### 1. Clone the repository
~~~
  git clone https://github.com/your-username/resume-builder.git

  cd resume-builder
~~~

### 2. Setup Backend
~~~
  cd apps/api
  npm install
~~~

* Create a `.env` file:
~~~
  DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/resume_builder"
  JWT_SECRET="your_secret_key"
  PORT=8080
~~~

* Run migrations
~~~
  npx prisma migrate dev
  npx prisma generate
~~~

### 3. Setup Frontend
~~~
  cd ../web
  npm install
  npm run dev
~~~

## 📡 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Resume
- POST /api/resume/generate
- GET /api/resume
- GET /api/resume/:id
- GET /api/resume/:id/download
- DELETE /api/resume/:id

---

## 🧪 Current Status

### ✅ Phase 1 — MVP (Completed)

- Resume builder
- PDF generation
- Authentication
- Database integration
- Resume CRUD (Create, Read, Update, Delete)
- Dashboard connected to real data
- Input validation

---

## 🚀 Upcoming Features

### 🔹 Phase 2 — ATS Optimization
- Job description input
- Keyword extraction
- ATS scoring system
- Resume-job matching

### 🔹 Phase 3 — AI Features
- Auto-generated summaries
- Bullet point rewriting
- Semantic optimization

---

## 🎯 What I Learned

- Designing scalable full-stack architecture
- Managing complex form state in React
- Building REST APIs with authentication
- Integrating LaTeX with Node.js
- Working with Prisma and relational databases
- Handling real-world CRUD workflows

---

## 📬 Contact

- LinkedIn: https://www.linkedin.com/in/andr%C3%A9s-v%C3%ADquez-marchena-b39490310/
- Email: viquezandres1811@gmail.com

---

## ⭐ Final Notes

This project was built with a strong focus on real-world usability and scalability, not just as a demo.

It reflects how a modern SaaS product is structured from frontend to backend, including authentication, persistence, and document generation.
