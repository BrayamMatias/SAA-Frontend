import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from 'src/app/services/auth/forgot-password.service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  formForgotPassword: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _forgotPasswordService: ForgotPasswordService,
    private _sweetAlert: SweetAlertService
  ){
    this.formForgotPassword = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
      ]],
    });
  }

  sendEmail(){
    if(this.formForgotPassword.valid){
      console.log(this.formForgotPassword.value.email);
      this._forgotPasswordService.sendEmail(this.formForgotPassword.value.email).subscribe(
        data => {
          console.log(data);
          this._sweetAlert.showSuccessAlert('Correo enviado con éxito, verifique su bandeja de entrada, si no lo encuentra revise la bandeja de spam');
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
          this._sweetAlert.showErrorAlert('Error al enviar el correo, verifique que el correo sea correcto o intente más tarde');
        }
      );
    }
  }
}
