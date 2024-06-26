import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../api/user'; 
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  getUserLogado() {
      throw new Error('Method not implemented.');
  }
  // private baseUrl = 'https://sistemagerenciamento-nbay.onrender.com/auth/login';
  private baseUrl = 'http://localhost:3000/users';

  user: User = {};
  constructor(private http: HttpClient, private userService: UserService ) { }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          this.userService.setUser(user);
          return user;
        } else {
          return null;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar usuários:', error);
        return of(null);
      })
    );
  } 

  isAuthenticated(): boolean {
    return !!this.userService.getUser(); 
  }
  

}
