import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://localhost:3000/teams'; 
  private userTeamsUrl = 'http://localhost:3000/userTeams'; 

  constructor(private http: HttpClient) { }

  
  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getTeamByID(id: number): Observable<any[]> {
    const url = `${this.userTeamsUrl}team_id=${id}`;
    return this.http.get<any[]>(url);
  }

  getTeamByIdUser(userId: number): Observable<any[]> {
    const url = `${this.userTeamsUrl}?user_id=${userId}`;
    return this.http.get<any[]>(url);
  }

  addTeam(team: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, team);
  }

  addUserTeams(userTeams: any[]): Observable<any[]> {
    return this.http.post<any[]>(this.userTeamsUrl, userTeams);
  }

  createTeamWithUsers(team: any, userTeams: any[]): Observable<any> {
    return new Observable(observer => {
      this.addTeam(team).subscribe(newTeam => {
        const userTeamsWithTeamId = userTeams.map(userTeam => ({
          user_id: userTeam.user_id,
          team_id: newTeam.team_id
        }));
        this.addUserTeams(userTeamsWithTeamId).subscribe(() => {
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
}
