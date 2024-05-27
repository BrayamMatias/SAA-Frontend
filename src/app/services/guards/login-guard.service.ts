import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate{

  constructor(private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if(user && user.roles){
      if(user.roles.includes('ADMIN_ROLE')){
        this.router.navigate(['/register']);
        return false;
      }
      if(user.roles.includes('USER_ROLE')){
        this.router.navigate(['/home']);
        return false;
      }
    }
    return true;
  }
}
