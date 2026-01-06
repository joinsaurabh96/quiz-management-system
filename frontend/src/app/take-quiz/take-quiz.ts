import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService, QuizSummary } from '../quiz.service';

@Component({
  selector: 'app-take-quiz',
  imports: [CommonModule],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.css',
})
export class TakeQuizComponent implements OnInit {
  quizzes: QuizSummary[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private quizService: QuizService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loading = true;
    this.quizService.getAllQuizzes().subscribe({
      next: (quizzes) => {
        console.log('Received quizzes:', quizzes);
        console.log('Type of quizzes:', typeof quizzes);
        console.log('Is array?', Array.isArray(quizzes));
        
        if (Array.isArray(quizzes)) {
          this.quizzes = quizzes;
        } else if (quizzes && typeof quizzes === 'object') {
          // Handle case where response might be wrapped
          const response = quizzes as any;
          this.quizzes = Array.isArray(response.data) ? response.data : [response];
        } else {
          this.quizzes = [];
        }
        
        console.log('Quizzes array after assignment:', this.quizzes);
        console.log('Quizzes length:', this.quizzes.length);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load quizzes', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        this.error = 'Failed to load quizzes. Please check the console for details.';
        this.quizzes = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  takeQuiz(quiz: QuizSummary) {
    this.router.navigate(['/quiz', quiz.id]);
  }
}
