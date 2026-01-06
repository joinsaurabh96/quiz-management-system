import uuid
from sqlalchemy import Column, String, Text, ForeignKey, Boolean, Integer, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)

    questions = relationship(
        "Question",
        back_populates="quiz",
        cascade="all, delete-orphan"
    )


class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id"))
    type = Column(String, nullable=False)  # MCQ, TRUE_FALSE, TEXT
    text = Column(Text, nullable=False)

    quiz = relationship("Quiz", back_populates="questions")
    options = relationship(
        "Option",
        back_populates="question",
        cascade="all, delete-orphan"
    )


class Option(Base):
    __tablename__ = "options"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"))
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)

    question = relationship("Question", back_populates="options")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id"), nullable=False)
    answers = Column(JSON, nullable=False)  # Store user responses as JSON
    score = Column(Integer, nullable=False)  # Calculated score
    total = Column(Integer, nullable=False)  # Total auto-gradable questions
    created_at = Column(DateTime, default=datetime.utcnow)

    quiz = relationship("Quiz")