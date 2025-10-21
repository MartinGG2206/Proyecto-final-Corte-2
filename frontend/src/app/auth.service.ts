// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient) {}

  register(username: string, password: string) {
    return this.http.post(`${this.base}/register/`, { username, password });
  }

  login(username: string, password: string): Observable<{access: string, refresh: string}> {
    return this.http.post<{access: string, refresh: string}>(`${this.base}/token/`, { username, password })
      .pipe(tap(tokens => {
        localStorage.setItem('access', tokens.access);
        localStorage.setItem('refresh', tokens.refresh);
      }));
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  get token() { return localStorage.getItem('access'); }
  isLoggedIn() { return !!this.token; }
}
