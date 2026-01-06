import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizService } from '../quiz.service';

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
      const questions = formValue.questions.map((q: any, index: number) => {
        const question: any = {
          type: q.type,
          text: q.questionText
        };

        if (q.type === 'MCQ') {
          question.options = q.options.map((opt: string, optIndex: number) => ({
            text: opt,
            is_correct: optIndex === q.correctAnswer
          }));
        } else if (q.type === 'TRUE_FALSE') {
          question.options = [
            { text: 'True', is_correct: q.correctAnswer },
            { text: 'False', is_correct: !q.correctAnswer }
          ];
        }
        // For TEXT type, no options needed

        return question;
      });

      const quizData = {
        title: formValue.title,
        questions
      };

      this.quizService.createQuiz(quizData).subscribe({
        next: (response) => {
          alert('Quiz created successfully!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          alert('Failed to create quiz');
          console.error(error);
        }
      });
    }
  }
}
