import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../api/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/users';

  userLogado: User;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getUserById(userId: number): Observable<any[]> {
    const url = `${this.baseUrl}?user_id=${userId}`;
    return this.http.get<any>(url);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, user);
  }

  updateUser(user: any): Observable<any> {
    const url = `${this.baseUrl}/${user.user_id}`;
    return this.http.put<any>(url, user);
  }

  deleteUser(userId: number): Observable<any> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.delete<any>(url);
  }
  setUser(user: any) {
    this.userLogado = user;
  }

  getUser() {
    return this.userLogado;
  }

  isLoggedIn() {
    return this.userLogado !== null;
  }

}
