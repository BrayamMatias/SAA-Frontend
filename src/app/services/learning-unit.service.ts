import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearnUnit } from '../interfaces/learn-unit';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class LearningUnitService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/subjects';
  }
  
  getLearningUnit(id: string): Observable<LearnUnit> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<LearnUnit>(`${this.myAppUrl}${this.myApiUrl}/${id}`, {headers});
  }
  
  getLearningUnits(): Observable<LearnUnit[]> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<LearnUnit[]>(`${this.myAppUrl}${this.myApiUrl}`, {headers});
  }
  
  createLearningUnit(learnUnit: LearnUnit): Observable<LearnUnit> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.post<LearnUnit>(`${this.myAppUrl}${this.myApiUrl}`, learnUnit, {headers});
  }
  
  updateLearningUnit(id: string, learnUnit: Partial<LearnUnit>): Observable<LearnUnit> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.put<LearnUnit>(`${this.myAppUrl}${this.myApiUrl}/${id}`, learnUnit, { headers });
  }
  
  deleteLearningUnit(id: string): Observable<LearnUnit> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.delete<LearnUnit>(`${this.myAppUrl}${this.myApiUrl}/${id}`, {headers});
  }


}
