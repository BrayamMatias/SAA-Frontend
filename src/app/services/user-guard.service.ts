import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuardService implements CanActivate{

  constructor(private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if(user && user.role && user.role.includes('USER_ROLE')){
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
