import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://localhost:3000/teams';
  private userTeamsUrl = 'http://localhost:3000/userTeams';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getUserTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.userTeamsUrl);
  }

  getTeamByID(id: number): Observable<any[]> {
    const url = `${this.userTeamsUrl}?team_id=${id}`;
    return this.http.get<any[]>(url);
  }

  getTimeByID(id: number): Observable<any[]> {
    const url = `${this.baseUrl}?team_id=${id}`;
    return this.http.get<any[]>(url);
  }
  getTeamByIdUser(userId: number): Observable<any[]> {
    const url = `${this.userTeamsUrl}?user_id=${userId}`;
    return this.http.get<any[]>(url);
  }

  addTeam(team: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, team);
  }

  addUserTeam(userTeam: any): Observable<any> {
    return this.http.post<any>(this.userTeamsUrl, userTeam);
  }

  createTeamWithUsers(team: any, userTeams: any[]): Observable<any> {
    return new Observable((observer) => {
      this.addTeam(team).subscribe((newTeam) => {
        const userTeamsWithTeamId = userTeams.map((userTeam) => ({
          ...userTeam,
          team_id: newTeam.team_id,
          id: this.generateUniqueId()
        }));

        const observables = userTeamsWithTeamId.map((userTeam) => this.addUserTeam(userTeam));

        forkJoin(observables).subscribe(() => {
          observer.next(newTeam);
          observer.complete();
        });
      });
    });
  }
  updateTeam(team: any): Observable<any> {
    const url = `${this.baseUrl}/${team.team_id}`;
    return this.http.put<any>(url, team);
  }

  deleteTeam(teamId: number): Observable<any> {
    const url = `${this.baseUrl}/${teamId}`;
    return this.http.delete<any>(url);
  }

  private generateUniqueId(): number {
    return Math.random();
  }
}
