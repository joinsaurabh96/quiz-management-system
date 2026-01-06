import { Injectable } from '@angular/core';

export interface Question {
  id: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'TEXT';
  questionText: string;
  options?: string[]; // for MCQ
  correctAnswer: string | boolean; // string for TEXT and MCQ, boolean for TRUE_FALSE
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quizzes: Quiz[] = [];

  constructor() {
    // Load from localStorage
    const stored = localStorage.getItem('quizzes');
    if (stored) {
      this.quizzes = JSON.parse(stored);
    }
  }

  getQuizzes(): Quiz[] {
    return this.quizzes;
  }

  getQuiz(id: string): Quiz | undefined {
    return this.quizzes.find(q => q.id === id);
  }

  addQuiz(quiz: Omit<Quiz, 'id'>): void {
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString()
    };
    this.quizzes.push(newQuiz);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    localStorage.setItem('quizzes', JSON.stringify(this.quizzes));
  }
}