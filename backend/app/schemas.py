from pydantic import BaseModel
from typing import List, Optional, Any
from uuid import UUID


class OptionCreate(BaseModel):
    text: str
    is_correct: bool


class QuestionCreate(BaseModel):
    type: str
    text: str
    options: Optional[List[OptionCreate]] = []


class QuizCreate(BaseModel):
    title: str
    questions: List[QuestionCreate]


class QuizResponse(BaseModel):
    id: UUID
    title: str

    class Config:
        from_attributes = True


class QuizSubmit(BaseModel):
    answers: List[Any]  # User answers - can be int (MCQ index), bool (True/False), or str (text)


class QuizSubmitResponse(BaseModel):
    id: str
    score: int
    total: int
    answers: List[Any]