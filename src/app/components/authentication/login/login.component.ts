import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/auth/login.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private _loginService: LoginService,
    private router: Router,
    private _sweetAlertService: SweetAlertService,
  ) {
    this.formLogin = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
      ]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  login() {
    if (this.formLogin.valid) {
      this._loginService.login(this.formLogin.value).subscribe((data: any) => {
        //Guardamos el token en el local storage
        console.log(data);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        console.log(data.roles);
        this.router.navigate([this.redirectUser(data.roles)]);
      }, (error) => {
        this._sweetAlertService.showErrorAlert(error.error.message);
      });
    } 
  }

  redirectUser(role: string): string{
    if(role.includes('ADMIN_ROLE')){
      return '/register';
    } else if(role.includes('USER_ROLE')){
      return '/home';
  }else{
    return '/login';
    }
  }
}
