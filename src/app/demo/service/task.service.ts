import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
//   private baseUrl = 'http://localhost:3000/tasks';
  private baseUrl = 'https://sistemagerenciamento-nbay.onrender.com/tasks';

  constructor(private http: HttpClient) { }

  // Método para obter todas as tarefas
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getTaskById(taskId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?task_id=${taskId}`);
  }

  getTasksByProject(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/project/${id}`);
    // creturn this.http.get<any[]>(`${this.baseUrl}?project_id=${id}`);
  }
  // Método para adicionar uma nova tarefa
  addTask(task: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, task);
  }

  // Método para atualizar uma tarefa existente
  updateTask(task: any): Observable<any> {
    const url = `${this.baseUrl}/${task.id}`;
    return this.http.put<any>(url, task);
  }

  // Método para excluir uma tarefa
  deleteTask(taskId: number): Observable<any> {
    const url = `${this.baseUrl}/${taskId}`;
    return this.http.delete<any>(url);
  }
}
