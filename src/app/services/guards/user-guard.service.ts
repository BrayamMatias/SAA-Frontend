import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuardService implements CanActivate{

  constructor(private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    const helper = new JwtHelperService();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    if(helper.isTokenExpired(token)){
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
      return false;
    }
    
    if(user && user.roles && user.roles.includes('USER_ROLE')){
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
