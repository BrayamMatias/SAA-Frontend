import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PeriodsService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/periods';
  }

  getPeriods(){
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}`, {headers});
  }

  createPeriod(period: any){
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, period,{headers});
  }
  
}
