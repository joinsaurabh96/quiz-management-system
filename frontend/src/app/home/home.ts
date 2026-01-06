import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  constructor(private router: Router) {}

  onCreateQuiz() {
    if (localStorage.getItem('isLoggedIn')) {
      this.router.navigate(['/admin/create-quiz']);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  onTakeQuiz() {
    this.router.navigate(['/quizzes']);
  }
}
