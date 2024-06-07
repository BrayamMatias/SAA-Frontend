import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/auth/register.service';
import { User } from 'src/app/interfaces/user';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  searchText: string = '';
  formRegister: FormGroup;
  displayedColumns: string[] = ['name', 'email', 'rol', 'accion'];
  dataSource = new MatTableDataSource<User>();
  operation: string = 'Registrar';
  id: string;

  length = 100;
  pageSizeOptions = [5, 10, 25];
  pageIndex = 0;
  pageSize = 10;
  showFirstLastButtons = true;
  pageEvent: PageEvent;

  roleNames = {
    'ADMIN_ROLE': 'Administrador',
    'USER_ROLE': 'Docente',
    // Agrega más roles aquí según sea necesario
  };

  constructor(
    private router: Router,
    private aRouter: ActivatedRoute,
    private fb: FormBuilder,
    private _registerService: RegisterService,
    private _sweetAlertService: SweetAlertService,
  ) {
    this.formRegister = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
      ]],
      password: ['', Validators.required],
      roles: ['', Validators.required],
    });
    this.id = aRouter.snapshot.paramMap.get('id') || '';  // Obteniendo id como string
  }

  ngOnInit(): void {
    this.getCountUsers();
    if (this.id != '') {  // Comprobando si id no es una cadena vacía
      this.operation = 'Actualizar';
      this.getUser(this.id);  // Llamando a getUser si estamos actualizando
    }
  }
  ngAfterViewInit(): void {
    this.getUsers(this.pageIndex * this.pageSize, this.pageSize);
  };

  handelPageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getUsers(this.pageIndex * this.pageSize, this.pageSize);
  }

  userHasBothRoles(): boolean {
    return this.user.roles.includes('ADMIN_ROLE') && this.user.roles.includes('USER_ROLE');
  }

  getCountUsers() {
    this._registerService.getCountUsers().subscribe((data: any) => {
      this.length = data.totalUsers;
    });
  }

  editUser(id: string) {
    this.id = id;
    this.operation = 'Actualizar';
    this.getUser(id);
  }

  getUser(id: string) {
    this._registerService.getUser(this.id).subscribe(data => {  // No necesitas llamar a toString() aquí
      this.formRegister.setValue({
        fullName: data.fullName,
        email: data.email,
        password: '',
        roles: data.roles,
      });
      // Deshabilita el campo de contraseña
      this.formRegister?.get('password')?.disable();
    });
  }

  getUsers(offset: number, limit: number) {
    this._registerService.getUsersPaginated(limit, offset).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  updateUser() {
    if (this.formRegister.valid) {
      this._registerService.updateUser(this.id, this.formRegister.value).subscribe(data => {
        this.operation = 'Registrar';
        this.id = '';
        this.formRegister.reset();
        this.router.navigate(['/register']);
        this.updateDatas();
        this._sweetAlertService.showSuccessToast('Usuario actualizado correctamente');
        this.formRegister?.get('password')?.enable();
      }, (error) => {
        this._sweetAlertService.showErrorAlert('El correo ya existe o hubo un error al actualizar');
      });
    }
  }

  createUser() {
    if (this.operation === 'Registrar') {
      if (this.formRegister.valid) {
        this._registerService.createUser(this.formRegister.value).subscribe(data => {
          this.formRegister.reset();
          this.router.navigate(['/register']);
          this.updateDatas();
          this._sweetAlertService.showSuccessToast('Usuario registrado correctamente');
        }, (error) => {
          this._sweetAlertService.showErrorAlert('El correo ya existe o hubo un error creando el usuario');
        });
      }
    } else if (this.operation === 'Actualizar') {
      this.updateUser();
    }
  }

  deleteUser(id: string) {
    this._sweetAlertService.showMessageConfirmation('Se eliminarán en cascada todos los elementos ligados a este usuario; esta acción no podrá revertirse.').then(result => {
      if (result.isConfirmed) {
        this._registerService.deleteUser(id).subscribe(data => {
          this.updateDatas();
          this._sweetAlertService.showSuccessToast('Usuario eliminado correctamente');
        },
          (error) => {
            this._sweetAlertService.showErrorToast('Error eliminando el usuario');
          });
      }
    });
  }

  hide = true;

  applyFilter() {
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      return data.fullName.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter);
    };
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  updateDatas() {
    this.getUsers(this.pageIndex * this.pageSize, this.pageSize);
    this.getCountUsers();
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}