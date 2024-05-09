import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/auth';
   }

   sendEmail(email: string){
    let params = new HttpParams().set('email', email);
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/forgot-password`, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  resetPassword(token: string, newPassword: string) {
    const body = { newPassword };
  
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/reset-password/${token}`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

}
