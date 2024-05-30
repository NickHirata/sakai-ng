import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpedimentService {
  private baseUrl = 'http://localhost:3000/impediments'; // Ajuste conforme necessário

  constructor(private http: HttpClient) { }

  getImpediments(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addImpediment(impediment: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, impediment);
  }

  updateImpediment(impediment: any): Observable<any> {
    const url = `${this.baseUrl}/${impediment.impediment_id}`;
    return this.http.put<any>(url, impediment);
  }

  deleteImpediment(impedimentId: number): Observable<any> {
    const url = `${this.baseUrl}/${impedimentId}`;
    return this.http.delete<any>(url);
  }
}
