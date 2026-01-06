import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { CreateQuizComponent } from './create-quiz/create-quiz';
import { TakeQuizComponent } from './take-quiz/take-quiz';
import { QuizPlayerComponent } from './quiz-player/quiz-player';
import { QuizResultComponent } from './quiz-result/quiz-result';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/create-quiz', component: CreateQuizComponent, canActivate: [AuthGuard] },
  { path: 'quizzes', component: TakeQuizComponent },
  { path: 'quiz/:id', component: QuizPlayerComponent },
  { path: 'quiz/:id/result', component: QuizResultComponent },
];
