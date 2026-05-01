# ResumeBuilder 🚀 — Phase 2: ATS Optimization

[![CI](https://github.com/andresvm18/resume-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/andresvm18/resume-builder/actions/workflows/ci.yml)

---

## ✨ Overview

Phase 2 transforms ResumeBuilder from a resume generator into an **ATS optimization platform**.

The application is now capable of:
- Interpreting job descriptions
- Extracting relevant keywords
- Comparing resumes against job requirements
- Scoring ATS compatibility
- Providing actionable recommendations to improve resumes

This phase introduces **NLP-inspired heuristics and rule-based analysis**, simulating real-world ATS behavior.

---

## 🧠 Key Features

### 📥 Job Description Input
- Dedicated step in the resume builder
- Allows users to paste a job offer
- Used as the basis for ATS analysis

---

### 🔍 Keyword Extraction Engine
- Text normalization (lowercase, accents removal)
- Stopwords filtering (Spanish)
- Generic word filtering (noise reduction)
- Smart n-gram generation (1–3 words)
- Frequency-based ranking
- Domain-aware boosting (technical + role-specific terms)

---

### ⚙️ Matching Engine
- Flexible keyword matching (not strict string comparison)
- Token-based comparison
- Partial match detection
- Handles different word order and phrasing

Example:
![alt text](image.png)


---

### 📊 ATS Scoring System

Composite score based on multiple factors:

~~~
ATS Score =
(keyword_match * 0.4) +
(section_completeness * 0.2) +
(format_quality * 0.2) +
(role_alignment * 0.2)
~~~


#### Breakdown

- **Keyword Match (40%)**
  Measures overlap between job keywords and resume content

- **Section Completeness (20%)**
  Ensures key resume sections are present

- **Format Quality (20%)**
  Evaluates clarity, structure, and content quality

- **Role Alignment (20%)**
  Measures overall consistency with the job description

---

### 💡 Recommendation Engine

Automatically generates suggestions such as:

- Missing keywords to include
- Sections to complete
- Weak experience descriptions to improve
- Alignment issues with the job role

Example:
![alt text](image-1.png)


---

### 🖥 ATS Analysis Panel

Displays:

- ATS Score
- Score breakdown
- Extracted keywords
- Matched keywords
- Missing keywords
- Actionable recommendations

---

## 🧪 Testing

### Frontend (ATS Engine)

- Unit tests for:
  - Keyword extraction
  - Matching logic
  - ATS score calculation
  - Recommendation generation

- Edge case testing:
  - Empty job descriptions
  - Weak resumes
  - Score boundaries (0–100)
  - Flexible matching validation

~~~
  cd apps/web
  npm test
~~~


---

## 🏗 Architecture Additions

### Frontend

New modules:
~~~
  /resume-builder
  ├── /components
  │ └── AtsAnalysisPanel.tsx
  ├── /utils
  │ └── ats.utils.ts
~~~


---

## 📈 Result

With Phase 2 completed, ResumeBuilder now:

✔ Generates resumes  
✔ Analyzes job descriptions  
✔ Evaluates ATS compatibility  
✔ Identifies missing content  
✔ Provides optimization guidance  

👉 The product evolves from a **document generator** into a **career optimization tool**

---

## 🧪 Current Status

### ✅ Phase 1 — MVP (Completed)
- Resume builder
- PDF generation
- Authentication
- Database integration
- Dashboard

---

### ✅ Phase 2 — ATS Optimization (Completed)

- Job description input
- Keyword extraction engine
- Resume-job matching
- ATS scoring system
- Recommendation engine
- ATS analysis panel
- Unit + edge case tests

---

## 🚀 Upcoming Features

### 🔹 Phase 3 — AI Optimization
- AI-generated summaries
- Experience rewriting (bullet points)
- Semantic keyword insertion
- Context-aware improvements

---

## 🎯 What I Learned (Phase 2)

- Designing heuristic NLP systems without external AI
- Implementing keyword extraction and ranking
- Building matching engines with flexible logic
- Designing scoring systems with weighted metrics
- Translating analysis into actionable UX feedback
- Testing complex logic with edge cases

---

## ⭐ Final Notes

Phase 2 introduces the core differentiator of the product:

👉 ResumeBuilder is no longer just a builder — it is an **optimization engine**.

This phase simulates how real ATS systems evaluate candidates and provides users with strategic insights to improve their chances in hiring processes.