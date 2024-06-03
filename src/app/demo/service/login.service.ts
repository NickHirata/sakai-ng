import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../api/user'; 

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'https://sistemagerenciamento-nbay.onrender.com/auth/login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.baseUrl, { email, password }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          // Redirecionar para tela de erro 400
          console.error('Erro 400 - Requisição inválida:', error);
          //this.router.navigate(['/error400']);
        } else if (error.status === 401) {
          // Redirecionar para tela de erro 401
          console.error('Erro 401 - Não autorizado:', error);
          //this.router.navigate(['/error401']);
        } else if (error.status === 500) {
          // Redirecionar para tela de erro 500
          console.error('Erro 500 - Erro interno do servidor:', error);
          //this.router.navigate(['/error500']);
        } else {
          // Outros códigos de erro
          console.error('Erro desconhecido:', error);
          //this.router.navigate(['/error']);
        }
        return throwError(error);
      })
    );
  }
}
