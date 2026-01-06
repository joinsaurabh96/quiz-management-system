import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  password = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.authService.login(this.password)) {
      this.router.navigate(['/admin/create-quiz']);
    } else {
      alert('Invalid password');
    }
  }
}
