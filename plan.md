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

## 5. Database Schema (Implemented)

### quizzes
| column      | type      | notes |
|------------|-----------|------|
| id         | uuid (pk) | |
| title      | text      | |

---

### questions
| column        | type      | notes |
|--------------|-----------|------|
| id           | uuid (pk) | |
| quiz_id      | uuid (fk)| references quizzes(id) |
| type         | text      | 'MCQ' | 'TRUE_FALSE' | 'TEXT' |
| text         | text      | question prompt |

---

### options
| column        | type      | notes |
|--------------|-----------|------|
| id           | uuid (pk) | |
| question_id  | uuid (fk)| references questions(id) |
| text         | text      | option text |
| is_correct   | boolean   | marks correct answer |

---

### submissions
| column      | type      | notes |
|------------|-----------|------|
| id         | uuid (pk) | |
| quiz_id    | uuid (fk) | references quizzes(id) |
| answers    | jsonb     | user responses array |
| score      | integer   | calculated score |
| total      | integer   | total auto-gradable questions |
| created_at | timestamp | submission timestamp |

---

## 6. API Endpoints (Implemented)

### Admin
- `POST /api/admin/login`
  - Admin login (returns token)
- `POST /api/quizzes`
  - Create quiz with questions (requires admin auth)

### Public
- `GET /api/quizzes`
  - Get all quizzes (list view)
- `GET /api/quizzes/{id}`
  - Fetch quiz with questions and options for taking
- `POST /api/quizzes/{id}/submit`
  - Submit answers and receive score (backend calculates)

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

### Changes Made:
1. **Database Schema**: 
   - Changed from JSONB storage for options to normalized relational tables (options table)
   - This provides better data integrity and query flexibility
   - Added `total` field to submissions to track auto-gradable question count

2. **Authentication**:
   - Added basic admin authentication (simple token-based) for quiz creation
   - This was necessary to protect the quiz creation endpoint as per requirements
   - Used environment variables for admin credentials

3. **Scoring Implementation**:
   - Moved scoring logic from frontend to backend for security and reliability
   - Backend now handles all score calculations and stores submissions
   - Frontend only displays results received from backend

4. **Question Type Handling**:
   - TEXT questions are stored but not auto-graded (as planned)
   - Only MCQ and TRUE_FALSE questions contribute to score
   - TEXT answers are stored in submissions for potential manual review

5. **API Response Format**:
   - Quiz endpoint returns structured JSON with nested questions and options
   - Ensures frontend receives consistent, properly formatted data

---

## 11. If I Had More Time

### Immediate Improvements:
1. **Enhanced Authentication**:
   - Proper JWT-based authentication with refresh tokens
   - User roles and permissions system
   - Password hashing and secure credential management

2. **Quiz Management**:
   - Edit and delete existing quizzes
   - Quiz versioning and history tracking
   - Draft/save functionality for quiz creation

3. **UI/UX Enhancements**:
   - Modern, responsive design with better styling
   - Loading states and error handling
   - Form validation feedback
   - Accessibility improvements (ARIA labels, keyboard navigation)

4. **Text Answer Review**:
   - Admin interface to review and grade text answers
   - Manual scoring workflow
   - Feedback system for text responses

### Advanced Features:
5. **Testing**:
   - Unit tests for backend logic (pytest)
   - Integration tests for API endpoints
   - Frontend component tests (Angular testing utilities)
   - E2E tests with Cypress or Playwright

6. **Deployment & DevOps**:
   - Docker containerization for both frontend and backend
   - CI/CD pipeline (GitHub Actions)
   - Environment configuration management
   - Database migrations (Alembic)
   - Production deployment on cloud platforms (Vercel/Railway/Heroku)

7. **Additional Features**:
   - Quiz analytics and statistics
   - Timer functionality for quizzes
   - Question randomization
   - Multiple attempts tracking
   - Export results to PDF/CSV
   - Email notifications for quiz completion
   - Public quiz sharing with unique URLs

---