# PLAN.md — Quiz Management System

#### Admin Panel
- Create a quiz with:
  - Title
  - Multiple questions
- Supported question types:
  - Multiple Choice (single correct answer)
  - True / False
  - Text (free-form, non-auto-graded)
- Persist quizzes and questions in the database.

#### Public Quiz Page
- Anyone can:
  - Open a quiz via a public URL
  - Answer all questions
  - Submit the quiz
- Results page:
  - Score (for auto-graded questions)
  - Correct answers shown for MCQ / True-False

#### Backend
- REST API for:
  - Creating quizzes
  - Fetching quizzes
  - Submitting answers
  - Calculating score

#### Database
- PostgreSQL (Neon) with a simple relational schema.

---

### Out of Scope (Intentionally)
- Authentication / user accounts
- Editing or deleting quizzes
- Timers, pagination, or question randomization
- Partial saves / resume quiz
- Advanced validation or analytics
- Styling beyond basic usability

---

## 3. Tech Stack

### Frontend
- Angular 21
- Angular Forms for quiz creation and submission
- Tailwind CSS for quick, consistent styling, Material
- HTTPClient for backend communication

### Backend
- Python with FastAPI
- RESTful API endpoints
- Pydantic for request/response validation
- Clear separation of routes, schemas, and database logic

### Database
- PostgreSQL (Neon DB)
- SQL schema defined explicitly
- UUIDs used as primary keys

### Tooling
- VS Code
- GitHub
- OBS for session recording

---

## 4. High-Level Architecture

[ Browser ] -> HTTP (JSON) -> [ API Layer ] -> [ PostgreSQL (Neon) ]

---

## 5. Database Schema (Initial)

### quizzes
| column      | type      | notes |
|------------|-----------|------|
| id         | uuid (pk) | |
| title      | text      | |
| created_at | timestamp | |

---

### questions
| column        | type      | notes |
|--------------|-----------|------|
| id           | uuid (pk) | |
| quiz_id      | uuid (fk)| references quizzes(id) |
| type         | text      | 'mcq' | 'true_false' | 'text' |
| prompt       | text      | |
| options      | jsonb     | for MCQ |
| correct_answer | jsonb   | auto-graded types only |

---

### submissions
| column      | type      | notes |
|------------|-----------|------|
| id         | uuid (pk) | |
| quiz_id    | uuid (fk) | |
| answers    | jsonb     | user responses |
| score      | integer   | calculated |
| created_at | timestamp | |

---

## 6. API Endpoints (Planned)

### Admin
- `POST /api/quizzes`
  - Create quiz with questions

### Public
- `GET /api/quizzes/:id`
  - Fetch quiz for taking
- `POST /api/quizzes/:id/submit`
  - Submit answers and receive score

---

## 7. Scoring Logic

- MCQ & True/False:
  - Exact match → +1
- Text questions:
  - Stored but **not auto-graded**
- Final score:
  - Number of correct auto-graded answers

This keeps logic simple and reliable within time constraints.

---

## 8. Implementation Plan (Time Breakdown)

**0–20 min**
- Project setup
- PLAN.md
- Database schema

**20–60 min**
- Backend APIs
- Scoring logic
- DB integration

**60–100 min**
- Admin UI (create quiz)
- Public quiz page

**100–120 min**
- Results page
- Manual testing
- Demo walkthrough

---

## 9. Trade-offs Made

- No authentication → faster iteration
- No quiz editing → simpler schema
- No text grading → avoids unreliable heuristics
- REST over GraphQL → less overhead

These choices prioritize **correctness, clarity, and delivery**.

---

## 10. Scope Changes During Implementation

(To be updated if scope changes during the session.)

---

## 11. If I Had More Time

- Add authentication & roles
- Quiz editing and versioning
- Better UI/UX polish
- Text answer review UI
- Automated tests
- Deployment with CI/CD

---