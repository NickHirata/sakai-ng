import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://localhost:3000/teams'; // Ajuste conforme necessário

  constructor(private http: HttpClient) { }

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addTeam(team: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, team);
  }

  updateTeam(team: any): Observable<any> {
    const url = `${this.baseUrl}/${team.team_id}`;
    return this.http.put<any>(url, team);
  }

  deleteTeam(teamId: number): Observable<any> {
    const url = `${this.baseUrl}/${teamId}`;
    return this.http.delete<any>(url);
  }
}
