import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { AuthService } from './auth.service';

export interface Option {
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  type: string;
  text: string;
  options?: Option[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface QuizSummary {
  id: string;
  title: string;
}

export interface QuizCreate {
  title: string;
  questions: {
    type: string;
    text: string;
    options?: Option[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  createQuiz(quiz: QuizCreate): Observable<any> {
    return this.http.post(`${this.API_URL}/quizzes`, quiz, { headers: this.getHeaders() });
  }

  getQuiz(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/quizzes/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }).pipe(
      timeout(10000), // 10 second timeout
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error in getQuiz:', error);
        return throwError(() => error);
      })
    );
  }

  // For listing all quizzes - we might need to add this endpoint to backend
  getAllQuizzes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/quizzes`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  submitQuiz(quizId: string, answers: any[]): Observable<any> {
    return this.http.post(`${this.API_URL}/quizzes/${quizId}/submit`, { answers }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }).pipe(
      timeout(15000), // 15 second timeout for submission
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error in submitQuiz:', error);
        return throwError(() => error);
      })
    );
  }
}