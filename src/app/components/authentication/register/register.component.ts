import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{
  formRegister: FormGroup;
  displayedColumns: string[] = ['name', 'email', 'accion'];
  dataSource = new MatTableDataSource<Teacher>();
  operation: string = 'Registrar';
  id: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor(
    private router: Router,
    private aRouter: ActivatedRoute,
    private fb: FormBuilder,
    private _registerService: RegisterService,
    ) { 
      this.formRegister = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
        ]],
        password: ['', Validators.required]
      });

      this.id = Number(aRouter.snapshot.paramMap.get('id'));
    }

  ngOnInit(): void {
    if(this.id != 0 ){
      this.operation = 'Editar';
    }
    const techers: Teacher[] = [
      {name: 'User 1', email: 'asdfas'},
      {name: 'User 2', email: 'asdfas'},
      {name: 'User 3', email: 'asdfas'},
      {name: 'User 4', email: 'asdfas'},
      {name: 'User 5', email: 'asdfas'},
      {name: 'User 6', email: 'asdfas'},
      {name: 'User 7', email: 'asdfas'},
      {name: 'User 8', email: 'asdfas'},
      {name: 'User 9', email: 'asdfas'},
      {name: 'User 10', email: 'asdfas'},
    ];

    this.dataSource = new MatTableDataSource(techers);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  };

  createUser(){
    if(this.formRegister.valid){
      this._registerService.createUser(this.formRegister.value).subscribe(data => {
        console.log(data);
        this.formRegister.reset();
        this.router.navigate(['/register']);
      });
    }
  
  }

  hide = true;

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

export interface Teacher {
  name: string;
  email: string;
}
