import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService, Quiz, Question } from '../quiz.service';

@Component({
  selector: 'app-quiz-result',
  imports: [CommonModule],
  templateUrl: './quiz-result.html',
  styleUrl: './quiz-result.css',
})
export class QuizResultComponent implements OnInit {
  quiz: Quiz | null = null;
  answers: any[] = [];
  score = 0;
  total = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const state = history.state;

    if (id && state.answers) {
      this.quiz = this.quizService.getQuiz(id) || null;
      this.answers = state.answers;
      this.score = state.score;
      this.total = state.total;
    } else {
      this.router.navigate(['/quizzes']);
    }
  }

  isCorrect(question: Question, userAnswer: any, index: number): boolean {
    if (question.type === 'MCQ') {
      return !!(question.options && userAnswer !== null && question.options[userAnswer] === question.correctAnswer);
    } else if (question.type === 'TRUE_FALSE') {
      return userAnswer === question.correctAnswer;
    } else {
      return (userAnswer as string).toLowerCase().trim() === (question.correctAnswer as string).toLowerCase().trim();
    }
  }

  getAnswerDisplay(question: Question, answer: any): string {
    if (question.type === 'MCQ') {
      return question.options ? question.options[answer] || 'Not answered' : 'Not answered';
    } else if (question.type === 'TRUE_FALSE') {
      return answer === true ? 'True' : answer === false ? 'False' : 'Not answered';
    } else {
      return (answer as string) || 'Not answered';
    }
  }

  getCorrectDisplay(question: Question): string {
    if (question.type === 'MCQ') {
      return question.options ? question.options.findIndex(opt => opt === question.correctAnswer) !== -1 ? question.correctAnswer as string : '' : '';
    } else if (question.type === 'TRUE_FALSE') {
      return question.correctAnswer ? 'True' : 'False';
    } else {
      return question.correctAnswer as string;
    }
  }

  getScorePercentage(): number {
    return this.total > 0 ? Math.round((this.score / this.total) * 100) : 0;
  }

  goBack() {
    this.router.navigate(['/quizzes']);
  }
}
