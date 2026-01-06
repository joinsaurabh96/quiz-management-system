# Quiz Management System

A production-ready quiz management system built with Angular (frontend) and FastAPI (backend), featuring an admin panel for quiz creation and a public interface for taking quizzes.

## Features

### Admin Panel
- Create quizzes with multiple question types:
  - Multiple Choice Questions (MCQ)
  - True/False questions
  - Text-based questions (free-form answers)
- Simple authentication for admin access
- Quiz creation with dynamic question and option management

### Public Quiz Interface
- Browse available quizzes
- Take quizzes with support for all question types
- View results with:
  - Score calculation (for auto-gradable questions)
  - Correct answers display (for MCQ and True/False)
  - Answer review

## Tech Stack

### Frontend
- **Angular 21** - Modern Angular framework
- **Bootstrap 5** - UI styling
- **Angular Material** - Component library
- **RxJS** - Reactive programming

### Backend
- **Python 3** - Programming language
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Database (Neon DB compatible)

## Project Structure

```
quiz-management-system/
├── backend/
│   └── app/
│       ├── main.py          # FastAPI application entry point
│       ├── models.py        # Database models
│       ├── schemas.py       # Pydantic schemas
│       ├── routes.py        # API routes
│       ├── quiz_engine.py   # Business logic
│       ├── database.py      # Database configuration
│       └── auth.py          # Authentication logic
├── frontend/
│   └── src/
│       └── app/
│           ├── home/              # Home page
│           ├── login/             # Admin login
│           ├── create-quiz/       # Quiz creation
│           ├── take-quiz/         # Quiz listing
│           ├── quiz-player/       # Quiz taking interface
│           └── quiz-result/       # Results display
└── plan.md                  # Project plan and documentation
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL database (or Neon DB connection string)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://user:password@host:port/database
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
ADMIN_TOKEN=your_secret_token
```

5. Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200/`

## API Endpoints

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `POST /api/quizzes` - Create a new quiz (requires admin auth)

### Public Endpoints
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/{id}` - Get quiz details
- `POST /api/quizzes/{id}/submit` - Submit quiz answers

## Database Schema

The system uses PostgreSQL with the following tables:
- `quizzes` - Stores quiz information
- `questions` - Stores questions linked to quizzes
- `options` - Stores answer options for questions
- `submissions` - Stores quiz submissions and scores

See `plan.md` for detailed schema documentation.

## Scoring Logic

- **MCQ Questions**: Auto-graded based on selected option
- **True/False Questions**: Auto-graded based on boolean answer
- **Text Questions**: Stored but not auto-graded (for manual review)

Final score = Number of correct auto-gradable answers / Total auto-gradable questions

## Development Notes

- The backend uses SQLAlchemy ORM with automatic table creation
- CORS is configured for local development (localhost:4200)
- Admin authentication uses simple token-based auth (Bearer token)
- All API responses use JSON format

## Future Enhancements

See `plan.md` section "11. If I Had More Time" for planned improvements including:
- Enhanced authentication
- Quiz editing capabilities
- Better UI/UX
- Automated testing
- Deployment configuration

## License

This project was created as an interview assignment.
