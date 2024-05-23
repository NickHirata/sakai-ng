// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // URL base da sua API

  constructor(private http: HttpClient) {}

  registerUser(userData: UserRegistrationData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData);
  }
}
