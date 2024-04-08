import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/auth';
   }

   login(credentials: {email: string, password: string}): Observable<User> {
    return this.http.post<User>(`${this.myAppUrl}${this.myApiUrl}/login`, credentials);
  }


}
