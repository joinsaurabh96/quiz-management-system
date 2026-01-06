from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
import os

from .database import SessionLocal
from .quiz_engine import QuizEngine
from .schemas import QuizCreate, QuizSubmit
from .auth import admin_required
from pydantic import BaseModel

router = APIRouter()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------
# Admin Login
# --------------------
class AdminLogin(BaseModel):
    email: str
    password: str


@router.post("/admin/login")
def admin_login(data: AdminLogin):
    if data.email == ADMIN_EMAIL and data.password == ADMIN_PASSWORD:
        return {"token": ADMIN_TOKEN}
    raise HTTPException(status_code=401, detail="Invalid credentials")


# --------------------
# Admin-only: Create Quiz
# --------------------
@router.post("/quizzes", dependencies=[Depends(admin_required)])
def create_quiz(quiz: QuizCreate, db: Session = Depends(get_db)):
    engine = QuizEngine(db)
    created_quiz = engine.create_quiz(quiz)
    return {"id": str(created_quiz.id), "title": created_quiz.title}


# --------------------
# Public: Get All Quizzes
# --------------------
@router.get("/quizzes")
def get_all_quizzes(db: Session = Depends(get_db)):
    engine = QuizEngine(db)
    quizzes = engine.get_all_quizzes()
    return [{"id": str(quiz.id), "title": quiz.title} for quiz in quizzes]


# --------------------
# Public: Get Quiz
# --------------------
@router.get("/quizzes/{quiz_id}")
def get_quiz(quiz_id: UUID, db: Session = Depends(get_db)):
    engine = QuizEngine(db)
    quiz = engine.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


# --------------------
# Public: Submit Quiz
# --------------------
@router.post("/quizzes/{quiz_id}/submit")
def submit_quiz(quiz_id: UUID, submission: QuizSubmit, db: Session = Depends(get_db)):
    engine = QuizEngine(db)
    try:
        result = engine.submit_quiz(quiz_id, submission.answers)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting quiz: {str(e)}")