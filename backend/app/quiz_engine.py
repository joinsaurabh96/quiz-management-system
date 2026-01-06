from sqlalchemy.orm import Session
from uuid import UUID
from typing import Dict, Any, List
from . import models, schemas


class QuizEngine:
    def __init__(self, db: Session):
        self.db = db

    def create_quiz(self, quiz_data: schemas.QuizCreate):
        quiz = models.Quiz(title=quiz_data.title)

        for q in quiz_data.questions:
            question = models.Question(
                type=q.type,
                text=q.text
            )

            for opt in q.options or []:
                option = models.Option(
                    text=opt.text,
                    is_correct=opt.is_correct
                )
                question.options.append(option)

            quiz.questions.append(question)

        self.db.add(quiz)
        self.db.commit()
        self.db.refresh(quiz)
        return quiz

    def get_quiz(self, quiz_id: UUID):
        quiz = (
            self.db
            .query(models.Quiz)
            .filter(models.Quiz.id == quiz_id)
            .first()
        )
        if not quiz:
            return None
        
        # Format quiz data with questions and options
        return {
            "id": str(quiz.id),
            "title": quiz.title,
            "questions": [
                {
                    "id": str(q.id),
                    "type": q.type,
                    "text": q.text,
                    "options": [
                        {
                            "text": opt.text,
                            "is_correct": opt.is_correct
                        }
                        for opt in q.options
                    ] if q.options else []
                }
                for q in quiz.questions
            ]
        }

    def get_all_quizzes(self):
        return (
            self.db
            .query(models.Quiz)
            .all()
        )

    def submit_quiz(self, quiz_id: UUID, answers: List[Any]) -> Dict[str, Any]:
        """Submit quiz answers and calculate score"""
        quiz = (
            self.db
            .query(models.Quiz)
            .filter(models.Quiz.id == quiz_id)
            .first()
        )
        
        if not quiz:
            raise ValueError("Quiz not found")
        
        score = 0
        total_auto_gradable = 0
        
        # Calculate score for auto-gradable questions
        for i, question in enumerate(quiz.questions):
            if i >= len(answers):
                continue
                
            user_answer = answers[i]
            
            # Only auto-grade MCQ and TRUE_FALSE questions
            if question.type in ['MCQ', 'TRUE_FALSE']:
                total_auto_gradable += 1
                is_correct = False
                
                if question.type == 'MCQ':
                    # For MCQ, user_answer is the index of selected option
                    if isinstance(user_answer, (int, str)) and user_answer != '':
                        try:
                            option_index = int(user_answer)
                            if 0 <= option_index < len(question.options):
                                is_correct = question.options[option_index].is_correct
                        except (ValueError, TypeError):
                            pass
                elif question.type == 'TRUE_FALSE':
                    # For TRUE_FALSE, user_answer is boolean
                    # Find the correct option
                    correct_option = next((opt for opt in question.options if opt.is_correct), None)
                    if correct_option:
                        # Check if user answer matches correct option text
                        user_answer_str = 'True' if user_answer is True else 'False'
                        is_correct = correct_option.text.lower() == user_answer_str.lower()
                
                if is_correct:
                    score += 1
        
        # Create submission record
        submission = models.Submission(
            quiz_id=quiz_id,
            answers=answers,
            score=score,
            total=total_auto_gradable
        )
        
        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)
        
        return {
            "id": str(submission.id),
            "score": score,
            "total": total_auto_gradable,
            "answers": answers
        }