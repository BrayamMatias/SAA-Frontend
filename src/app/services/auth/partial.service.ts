import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PartialService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/partial';
  }

  getPartial(id: string) {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/${id}`, {headers});
  }

  getPartials() {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}`, {headers});
  }

  createPartial(periodId: String,partial: any[]) {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/${periodId}`, partial, {headers});
  }

  updatePartial(id: string, partial: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.patch(`${this.myAppUrl}${this.myApiUrl}/${id}`, partial, { headers });
  }

  deletePartial(id: string) {
    const headers = new HttpHeaders().set('Authorization',  `Bearer ${localStorage.getItem('token')}`)
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/${id}`, {headers});
  }
  

}
