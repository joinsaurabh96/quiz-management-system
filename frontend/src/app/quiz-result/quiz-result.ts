import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService, Quiz, Question } from '../quiz.service';

@Component({
  selector: 'app-quiz-result',
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz-result.html',
  styleUrl: './quiz-result.css',
})
export class QuizResultComponent implements OnInit {
  quiz: Quiz | null = null;
  answers: any[] = [];
  score = 0;
  total = 0;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const state = history.state;

    console.log('Quiz Result - ID:', id);
    console.log('Quiz Result - State:', state);

    if (!id) {
      console.error('No quiz ID in route');
      this.error = 'No quiz ID provided';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    // Try to get data from navigation state first
    if (state && state.answers && state.score !== undefined && state.total !== undefined) {
      console.log('Using navigation state data');
      this.answers = state.answers;
      this.score = state.score;
      this.total = state.total;
      
      // Load quiz data
      this.quizService.getQuiz(id).subscribe({
        next: (quiz) => {
          console.log('Quiz loaded for result:', quiz);
          this.quiz = quiz;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to load quiz', error);
          this.error = 'Failed to load quiz data';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // No state data - redirect back to quizzes
      console.warn('No state data found, redirecting to quizzes');
      this.error = 'Quiz submission data not found. Please take the quiz again.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  isCorrect(question: Question, userAnswer: any, index: number): boolean | null {
    // TEXT questions are not auto-graded, return null to indicate "not applicable"
    if (question.type === 'TEXT') {
      return null;
    }
    
    if (question.type === 'MCQ') {
      // For MCQ, userAnswer is the index of selected option
      return !!(question.options && userAnswer !== null && question.options[userAnswer]?.is_correct);
    } else if (question.type === 'TRUE_FALSE') {
      // For TRUE_FALSE, userAnswer is boolean, check if it matches the correct option
      return !!(question.options && question.options.find(opt => opt.is_correct)?.text.toLowerCase() === (userAnswer ? 'true' : 'false'));
    }
    return false;
  }

  getAnswerDisplay(question: Question, answer: any): string {
    if (question.type === 'MCQ') {
      return question.options && answer !== null ? question.options[answer]?.text || 'Not answered' : 'Not answered';
    } else if (question.type === 'TRUE_FALSE') {
      return answer === true ? 'True' : answer === false ? 'False' : 'Not answered';
    } else {
      return (answer as string) || 'Not answered';
    }
  }

  getCorrectDisplay(question: Question): string {
    // TEXT questions don't have a correct answer displayed (not auto-graded)
    if (question.type === 'TEXT') {
      return 'Not auto-graded';
    }
    
    const correctOption = question.options?.find(opt => opt.is_correct);
    if (question.type === 'MCQ') {
      return correctOption?.text || '';
    } else if (question.type === 'TRUE_FALSE') {
      return correctOption?.text || '';
    }
    return '';
  }

  getScorePercentage(): number {
    return this.total > 0 ? Math.round((this.score / this.total) * 100) : 0;
  }

  goBack() {
    this.router.navigate(['/quizzes']);
  }
}
