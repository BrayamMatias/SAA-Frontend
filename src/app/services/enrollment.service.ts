import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Enrollment } from '../interfaces/enrollment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/enrollments';
   }

   getEnrollment(id: string){
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/${id}`, {headers});
   }

   getEnrollments(){
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}`, {headers});
   }

  createEnrollment(enrollment: Enrollment){
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, enrollment, {headers});
  }

  updateEnrollment(id: string, enrollment: Partial<Enrollment>){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.patch(`${this.myAppUrl}${this.myApiUrl}/${id}`, enrollment, { headers });
  }

  deleteEnrollment(id: string){
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/${id}`, {headers});
  }
}
