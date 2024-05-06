import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Student } from '../../interfaces/student';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/students';
  }

  getStudent(id: string): Observable<Student> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<Student>(`${this.myAppUrl}${this.myApiUrl}/${id}`, {headers});
  }

  getStudents(): Observable<Student[]> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<Student[]>(`${this.myAppUrl}${this.myApiUrl}`, {headers});
  }

  createStudent(student: Student): Observable<Student> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.post<Student>(`${this.myAppUrl}${this.myApiUrl}`, student, {headers});
  }

  updateStudent(id: string, student: Partial<Student>): Observable<Student> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.patch<Student>(`${this.myAppUrl}${this.myApiUrl}/${id}`, student, { headers });
  }

  deleteStudent(id: string): Observable<Student> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.delete<Student>(`${this.myAppUrl}${this.myApiUrl}/${id}`, {headers});
  }

}
