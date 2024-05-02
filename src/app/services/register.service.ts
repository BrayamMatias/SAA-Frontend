import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/auth';
  }

  getUser(id: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<User>(`${this.myAppUrl}${this.myApiUrl}/users/${id}`, {headers});
  }

  getUsers(): Observable<User[]> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get<User[]>(`${this.myAppUrl}${this.myApiUrl}/users`, {headers});
  }
  createUser(user: User): Observable<User> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.post<User>(`${this.myAppUrl}${this.myApiUrl}/register`, user, {headers});
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.patch<User>(`${this.myAppUrl}${this.myApiUrl}/users/${id}`, user, { headers });
  }

  deleteUser(id: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.delete<User>(`${this.myAppUrl}${this.myApiUrl}/users/${id}`, {headers});
  }

}
