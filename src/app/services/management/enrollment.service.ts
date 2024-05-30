import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Enrollment } from '../../interfaces/enrollment';
import { Observable } from 'rxjs';
import { Student, StudentEnrollment} from 'src/app/interfaces/student';
import { User } from 'src/app/interfaces/user';

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

   getEnrollment(id: string): Observable<Student>{
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<Student>(`${this.myAppUrl}${this.myApiUrl}/${id}`, {headers});
   }

   getEnrollments(id: string): Observable<Student[]>{
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<Student[]>(`${this.myAppUrl}${this.myApiUrl}/subject/${id}`, {headers});
   }

   getEnrollmentspaginated(id: string, limit:number, offset:number): Observable<Student[]>{
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<Student[]>(`${this.myAppUrl}${this.myApiUrl}/subject/${id}?limit=${limit}&offset=${offset}`, {headers});
   }

   getNotEnrolledStudents(id: string,limit:number, offset:number): Observable<Student[]>{
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<Student[]>(`${this.myAppUrl}${this.myApiUrl}/subject/${id}/not-enrolled?limit=${limit}&offset=${offset}`, {headers});
   }

  createEnrollment(id: string,enrollments: Enrollment[]){
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/${id}`, enrollments, {headers});
  }

  deleteEnrollments(enrollments: StudentEnrollment[]) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.request('delete', `${this.myAppUrl}${this.myApiUrl}/many-enrollments`, { body: enrollments, headers });
}
}
