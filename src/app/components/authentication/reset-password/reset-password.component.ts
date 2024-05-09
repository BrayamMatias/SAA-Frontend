import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordService } from 'src/app/services/auth/forgot-password.service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  token: string = '';
  formResetPassword: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _forgotPasswordService: ForgotPasswordService,
    private _sweetAlert: SweetAlertService
  ){
    this.formResetPassword = this.fb.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    console.log(this.token);
  }

  resetPassword(){
    if(this.formResetPassword.valid){
      this._forgotPasswordService.resetPassword(this.token, this.formResetPassword.value.password).subscribe(
        data => {
          console.log(data);
          this._sweetAlert.showSuccessAlert('Contraseña actualizada con éxito');
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
          this._sweetAlert.showErrorAlert('Error al actualizar la contraseña, intente más tarde');
        }
      );
    }
  }
}
