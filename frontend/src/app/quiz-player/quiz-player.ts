import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizService, Quiz, Question } from '../quiz.service';

@Component({
  selector: 'app-quiz-player',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './quiz-player.html',
  styleUrl: './quiz-player.css',
})
export class QuizPlayerComponent implements OnInit {
  quiz: Quiz | null = null;
  quizForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({
      answers: this.fb.array([])
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.quiz = this.quizService.getQuiz(id) || null;
      if (this.quiz) {
        const answersArray = this.quizForm.get('answers') as FormArray;
        this.quiz.questions.forEach(q => {
          let control;
          if (q.type === 'MCQ') {
            control = this.fb.control('');
          } else if (q.type === 'TRUE_FALSE') {
            control = this.fb.control(null);
          } else {
            control = this.fb.control('', Validators.required);
          }
          answersArray.push(control);
        });
      }
    }
  }

  get answers(): FormArray {
    return this.quizForm.get('answers') as FormArray;
  }

  getAnswerControl(index: number): FormControl {
    return this.answers.at(index) as FormControl;
  }

  submitQuiz() {
    if (!this.quiz || !this.quizForm.valid) return;

    const answers = this.quizForm.value.answers;
    let score = 0;

    this.quiz.questions.forEach((q, index) => {
      const userAnswer = answers[index];
      let correct = false;

      if (q.type === 'MCQ') {
        correct = !!(q.options && userAnswer !== null && q.options[userAnswer] === q.correctAnswer);
      } else if (q.type === 'TRUE_FALSE') {
        correct = userAnswer === q.correctAnswer;
      } else {
        correct = (userAnswer as string).toLowerCase().trim() === (q.correctAnswer as string).toLowerCase().trim();
      }

      if (correct) score++;
    });

    // Navigate to result with state
    this.router.navigate(['/quiz', this.quiz.id, 'result'], {
      state: { answers, score, total: this.quiz.questions.length }
    });
  }
}