import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.quizForm = this.fb.group({
      answers: this.fb.array([])
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Loading quiz with ID:', id);
    this.loading = true;
    this.error = null;
    this.quiz = null;
    
    if (id) {
      this.quizService.getQuiz(id).subscribe({
        next: (quiz) => {
          console.log('Received quiz data:', quiz);
          console.log('Quiz type:', typeof quiz);
          console.log('Quiz has questions?', quiz?.questions);
          
          try {
            if (quiz && quiz.id && quiz.title) {
              this.quiz = quiz;
              
              // Ensure questions array exists
              if (this.quiz && !this.quiz.questions) {
                this.quiz.questions = [];
              }
              
              console.log('Quiz loaded successfully:', this.quiz);
              if (this.quiz && this.quiz.questions) {
                console.log('Number of questions:', this.quiz.questions.length);
              }
              
              // Build form controls for answers
              const answersArray = this.quizForm.get('answers') as FormArray | null;
              if (answersArray) {
                answersArray.clear(); // Clear any existing controls
                
                if (this.quiz && this.quiz.questions) {
                  this.quiz.questions.forEach((q) => {
                    let control;
                    if (q.type === 'MCQ') {
                      control = this.fb.control('');
                    } else if (q.type === 'TRUE_FALSE') {
                      control = this.fb.control(''); // string for true/false radio buttons
                    } else {
                      // TEXT questions don't require validation
                      control = this.fb.control('');
                    }
                    answersArray.push(control);
                  });
                }
              }
              
              this.loading = false;
              this.cdr.detectChanges();
            } else {
              console.error('Invalid quiz data received:', quiz);
              this.quiz = null;
              this.error = 'Invalid quiz data received from server';
              this.loading = false;
              this.cdr.detectChanges();
            }
          } catch (err) {
            console.error('Error processing quiz data:', err);
            this.quiz = null;
            this.error = 'Error processing quiz data';
            this.loading = false;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Failed to load quiz', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          this.quiz = null;
          this.error = `Failed to load quiz: ${error.message || error.error?.detail || 'Unknown error'}`;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.error('No quiz ID provided in route');
      this.quiz = null;
      this.error = 'No quiz ID provided';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get answers(): FormArray {
    return this.quizForm.get('answers') as FormArray;
  }

  getAnswerControl(index: number): FormControl {
    return this.answers.at(index) as FormControl;
  }

  submitQuiz() {
    if (!this.quiz) {
      console.error('Quiz not loaded');
      return;
    }

    // Check if at least MCQ and TRUE_FALSE questions are answered
    const answers = this.quizForm.value.answers;
    let hasRequiredAnswers = true;
    
    this.quiz.questions.forEach((q, index) => {
      if (q.type !== 'TEXT' && (answers[index] === '' || answers[index] === null || answers[index] === undefined)) {
        hasRequiredAnswers = false;
      }
    });

    if (!hasRequiredAnswers) {
      alert('Please answer all required questions before submitting.');
      return;
    }
    
    // Convert answers to proper format for backend
    const formattedAnswers = answers.map((answer: any, index: number) => {
      const question = this.quiz!.questions[index];
      if (question.type === 'MCQ') {
        // Convert to number if it's a string
        return answer !== '' && answer !== null && answer !== undefined ? parseInt(answer, 10) : null;
      } else if (question.type === 'TRUE_FALSE') {
        // Handle string 'true'/'false' from radio buttons
        if (typeof answer === 'string') {
          return answer.toLowerCase() === 'true';
        }
        // Handle boolean values
        return answer === true || answer === 'true';
      } else {
        // TEXT - keep as string
        return answer || '';
      }
    });

    console.log('Submitting quiz with answers:', formattedAnswers);

    // Submit to backend
    this.quizService.submitQuiz(this.quiz.id, formattedAnswers).subscribe({
      next: (result) => {
        console.log('Quiz submitted successfully:', result);
        // Navigate to result with state from backend
        this.router.navigate(['/quiz', this.quiz!.id, 'result'], {
          state: { 
            answers: formattedAnswers, 
            score: result.score, 
            total: result.total 
          }
        });
      },
      error: (error) => {
        console.error('Failed to submit quiz', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        alert(`Failed to submit quiz: ${error.message || error.error?.detail || 'Unknown error'}`);
      }
    });
  }
}