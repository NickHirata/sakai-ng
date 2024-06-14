import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:3000/projects'; // Ajuste conforme necessário

  constructor(private http: HttpClient) { }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
  getProjectByID(id: number): Observable<any[]> {
    const url = `${this.baseUrl}?project_id=${id}`;
    return this.http.get<any[]>(url);
  }

  addProject(project: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, project);
  }

  updateProject(project: any): Observable<any> {
    const url = `${this.baseUrl}/${project.project_id}`;
    return this.http.put<any>(url, project);
  }

  deleteProject(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/${projectId}`;
    return this.http.delete<any>(url);
  }
}
