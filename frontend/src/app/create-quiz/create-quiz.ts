import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizService, Question } from '../quiz.service';

@Component({
  selector: 'app-create-quiz',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-quiz.html',
  styleUrl: './create-quiz.css',
})
export class CreateQuizComponent implements OnInit {
  quizForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private quizService: QuizService
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  ngOnInit() {}

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      type: ['MCQ', Validators.required],
      questionText: ['', Validators.required],
      options: this.fb.array([this.fb.control(''), this.fb.control('')]),
      correctAnswer: ['']
    });
    this.questions.push(questionGroup);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number) {
    this.getOptions(questionIndex).push(this.fb.control(''));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.getOptions(questionIndex).removeAt(optionIndex);
  }

  getOptionControl(questionIndex: number, optionIndex: number): FormControl {
    return this.getOptions(questionIndex).at(optionIndex) as FormControl;
  }

  onQuestionTypeChange(questionIndex: number) {
    const question = this.questions.at(questionIndex);
    const type = question.get('type')?.value;
    if (type === 'TRUE_FALSE') {
      question.get('correctAnswer')?.setValue(true);
    } else if (type === 'TEXT') {
      question.get('correctAnswer')?.setValue('');
    } else {
      question.get('correctAnswer')?.setValue(0);
    }
  }

  onSubmit() {
    if (this.quizForm.valid) {
      const formValue = this.quizForm.value;
      const questions: Question[] = formValue.questions.map((q: any, index: number) => {
        let correctAnswer: string | boolean;
        if (q.type === 'MCQ') {
          correctAnswer = q.options[q.correctAnswer];
        } else if (q.type === 'TRUE_FALSE') {
          correctAnswer = q.correctAnswer;
        } else {
          correctAnswer = q.correctAnswer;
        }
        return {
          id: (index + 1).toString(),
          type: q.type,
          questionText: q.questionText,
          options: q.type === 'MCQ' ? q.options : undefined,
          correctAnswer
        };
      });

      this.quizService.addQuiz({
        title: formValue.title,
        questions
      });

      alert('Quiz created successfully!');
      this.router.navigate(['/']);
    }
  }
}
