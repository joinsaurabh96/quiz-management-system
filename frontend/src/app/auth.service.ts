import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private readonly API_URL = 'http://localhost:8000/api'; // Adjust if backend runs on different port

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/admin/login`, { email, password });
  }

  setToken(token: string): void {
    localStorage.setItem('adminToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }
}