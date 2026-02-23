import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/applications.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private readonly API_URL = 'http://localhost:3000/applications';

  constructor(private http: HttpClient) { }

  getApplications(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.API_URL}?userId=${userId}`);
  }

  addApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.API_URL, application);
  }

  updateApplication(application: Application): Observable<Application> {
    return this.http.put<Application>(`${this.API_URL}/${application.id}`, application);
  }

  removeApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
