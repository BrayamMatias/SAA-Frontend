import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/attendances';
  }

  getReportByPartial(subjectId: string, startDate: string, finishDate: string) {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/report-by-partial?subjectId=${subjectId}&startDate=${startDate}&finishDate=${finishDate}`, { headers });
  }

  getReportByPeriod(subjectId: string,periodId: string) {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/report-by-period?subjectId=${subjectId}&period=${periodId}`, { headers });

  }

}
