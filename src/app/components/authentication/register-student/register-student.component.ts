import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from 'src/app/interfaces/student';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';
import { StudentService } from 'src/app/services/auth/student.service';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.css'
})

export class RegisterStudentComponent implements OnInit{
  searchText: string = '';
  formRegisterStudent: FormGroup;
  displayedColumns: string[] = ['fullName', 'matricula', 'accion'];
  dataSource = new MatTableDataSource<Student>();
  operation: string = 'Registrar';
  id: string;

  length = 100;
  pageSizeOptions = [5, 10, 25];
  pageIndex = 0;
  pageSize = 10;
  showFirstLastButtons = true;
  pageEvent: PageEvent;

  constructor(
    private router: Router,
    private aRouter: ActivatedRoute,
    private fb: FormBuilder,
    private _studentService: StudentService,
    private _sweetAlertService: SweetAlertService,
    ) { 
      this.formRegisterStudent = this.fb.group({
        fullName: ['', Validators.required],
        matricula: ['', Validators.required],
      });

      this.id = aRouter.snapshot.paramMap.get('id') || '';  // Obteniendo id como string
    }

  ngOnInit(): void {
    if(this.id != '' ){  // Comprobando si id no es una cadena vacía
      this.operation = 'Actualizar';
      this.getStudent(this.id);  // Llamando a getUser si estamos actualizando
    }
  }

  ngAfterViewInit(): void {
    this.getStudents(this.pageIndex * this.pageSize, this.pageSize);
  };

  handelPageEvent(event: PageEvent){
    this.length = event.length;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getStudents(this.pageIndex * this.pageSize, this.pageSize);
  }

  editStudent(id: string){
    this.id = id;
    this.operation = 'Actualizar';
    this.getStudent(id);
  }

  getStudent(id: string){
    this._studentService.getStudent(this.id).subscribe(data => {
      this.formRegisterStudent.setValue({
        fullName: data.fullName,
        matricula: data.matricula,
      });
    });
  }

  getStudents(offset: number, limit: number){
    this._studentService.getStudents(limit,offset).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  updateStudent(){
    if(this.formRegisterStudent.valid){
      this._studentService.updateStudent(this.id, this.formRegisterStudent.value).subscribe(data => {
        this.operation = 'Registrar';
        this.id = '';
        this.formRegisterStudent.reset();
        this.router.navigate(['/register-student']);
        this.getStudents(this.pageIndex * this.pageSize, this.pageSize);
        this._sweetAlertService.showSuccessToast('Alumno actualizado correctamente');
      }, (error) => {
        this._sweetAlertService.showErrorAlert('Los datos coinciden con otro alumno o hubo un error al actualizar');
      });
    }
  }

  createStudent(){
    if(this.operation === 'Registrar'){
      if(this.formRegisterStudent.valid){
        this._studentService.createStudent(this.formRegisterStudent.value).subscribe(data => {
          this.formRegisterStudent.reset();
          this.router.navigate(['/register-student']);
          this._sweetAlertService.showSuccessToast('Alumno registrado correctamente');
          this.getStudents(this.pageIndex * this.pageSize, this.pageSize);
        }, (error) => {
          this._sweetAlertService.showErrorAlert(error.error.message);
        });
      }
    } else if(this.operation === 'Actualizar'){
      this.updateStudent();
    }
  }

  deleteStudent(id: string){
    this._sweetAlertService.showDeleteConfirmation().then(result => {
      if(result.isConfirmed){
        this._studentService.deleteStudent(id).subscribe(data => {
          this.getStudents(this.pageIndex * this.pageSize, this.pageSize);
          this._sweetAlertService.showSuccessToast('Alumno eliminado correctamente');
        }, 
        (error) => {
          this._sweetAlertService.showErrorToast('Error eliminando al alumno');
        });
      }
    });
  }

  hide = true;

  applyFilter() {
    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      return data.fullName.toLowerCase().includes(filter) || data.matricula.toLowerCase().includes(filter);
    };
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}