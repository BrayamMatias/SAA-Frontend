import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
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
  id: string;  // Cambiado a string

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

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
    this.getStudents();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  };

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

  getStudents(){
    this._studentService.getStudents().subscribe(data => {
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
        this.getStudents();
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
          this.getStudents();
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
          this.getStudents();
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