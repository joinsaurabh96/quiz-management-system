import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService, Quiz } from '../quiz.service';

@Component({
  selector: 'app-take-quiz',
  imports: [CommonModule],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.css',
})
export class TakeQuizComponent implements OnInit {
  quizzes: Quiz[] = [];

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit() {
    this.quizzes = this.quizService.getQuizzes();
  }

  takeQuiz(quiz: Quiz) {
    this.router.navigate(['/quiz', quiz.id]);
  }
}
