import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendancesService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/attendances';
  }

  createAttendance(attendance: any) {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, attendance, { headers });
  }

  updateAttendance(attendance: any) {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.patch(`${this.myAppUrl}${this.myApiUrl}`, attendance, { headers });
  }

  getAttendances(id: string) {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/dates/${id}`, { headers });
  }

  getAttendanceByDate(subjectId: string, date: string) {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/by-date?subjectId=${subjectId}&date=${date}`, { headers });
  }
  
}
