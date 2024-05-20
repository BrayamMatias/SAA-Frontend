import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private periodId = new BehaviorSubject<string>('');
  currentPeriodId = this.periodId.asObservable();

  constructor(
    private cookieService: CookieService
  ) { }

  changePeriodId(periodId: string) {
    this.periodId.next(periodId);
    this.cookieService.set('periodId', periodId);
  }

}
