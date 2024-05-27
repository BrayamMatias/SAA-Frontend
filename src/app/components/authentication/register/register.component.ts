import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  searchText: string = '';
  formRegister: FormGroup;
  displayedColumns: string[] = ['name', 'email','rol','accion'];
  dataSource = new MatTableDataSource<User>();
  operation: string = 'Registrar';
  id: string;

  roleNames = {
    'ADMIN_ROLE': 'Administrador',
    'USER_ROLE': 'Docente',
    // Agrega más roles aquí según sea necesario
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


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
    if (this.id != '') {  // Comprobando si id no es una cadena vacía
      this.operation = 'Actualizar';
      this.getUser(this.id);  // Llamando a getUser si estamos actualizando
    }
    this.getUsers();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  };

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
        roles: data.roles[0],
      });
      // Deshabilita el campo de contraseña
      this.formRegister?.get('password')?.disable();
    });
  }

  getUsers() {
    this._registerService.getUsers().subscribe(data => {
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
        this.getUsers();
        this._sweetAlertService.showSuccessToast('Usuario actualizado correctamente');
        this.formRegister?.get('password')?.enable();
      }, (error) => {
        this._sweetAlertService.showErrorAlert(error.error.message);
      });
    }
  }

  createUser() {
    if (this.operation === 'Registrar') {
      if (this.formRegister.valid) {
        const formValue = this.formRegister.value;
        formValue.roles = [formValue.roles];
        this._registerService.createUser(this.formRegister.value).subscribe(data => {
          this.formRegister.reset();
          this.router.navigate(['/register']);
          this._sweetAlertService.showSuccessToast('Usuario registrado correctamente');
          this.getUsers();
        }, (error) => {
          this._sweetAlertService.showErrorAlert(error.error.message);
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
          this.getUsers();
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

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}