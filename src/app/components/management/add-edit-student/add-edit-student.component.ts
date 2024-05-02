import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Student } from 'src/app/interfaces/student';
import { StudentService } from 'src/app/services/student.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.css']
})
export class AddEditStudentComponent implements OnInit {
  subjectId: string ;
  searchTextAdd: string = '';
  searchTextDelete: string = '';
  displayedColumns: string[] = ['matricula', 'nombre', 'accion'];

  // DataSource y ViewChild para la primera tabla (Añadir Estudiantes)
  dataSourceAdd = new MatTableDataSource<Student>();
  @ViewChild('paginatorAdd') paginatorAdd!: MatPaginator;

  // DataSource y ViewChild para la segunda tabla (Eliminar Estudiantes)
  dataSourceDelete = new MatTableDataSource<Student>();
  @ViewChild('paginatorDelete') paginatorDelete!: MatPaginator;

  constructor(
    private aRouter: ActivatedRoute,
    private _studentService: StudentService,
    private _enrollmentService: EnrollmentService,


  ) {
    this.subjectId = String(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getStudents();
    console.log(this.subjectId);
  }
  ngAfterViewInit(): void{
    this.dataSourceAdd.paginator = this.paginatorAdd;
    this.dataSourceDelete.paginator = this.paginatorDelete;
  }

  getStudents(){
    this._studentService.getStudents().subscribe(data => {
      console.log(data);
      this.dataSourceAdd.data = data;
    });
  }

  createEnrollment(idStudent: string){
    let enrollment = {
      subjectId: this.subjectId,
      studentId: idStudent
    }
    console.log(enrollment);
    this._enrollmentService.createEnrollment(enrollment).subscribe(data => {
      console.log(data);
      this.getStudentsEnrolled();
    }, error => {
      console.error('Error:', error);
    });
  }

  getStudentsEnrolled(){
    this._enrollmentService.getEnrollments().subscribe(data => {
      console.log(data);
    });
  }

  applyFilterAdd() {
    this.dataSourceAdd.filterPredicate = (data: Student, filter: string) => {
      return data.matricula.toLowerCase().includes(filter) || data.fullName.toLowerCase().includes(filter);
    };
    this.dataSourceAdd.filter = this.searchTextAdd.trim().toLowerCase();
  }
  
  applyFilterDelete() {
    this.dataSourceDelete.filterPredicate = (data: Student, filter: string) => {
      return data.matricula.toLowerCase().includes(filter) || data.fullName.toLowerCase().includes(filter);
    };
    this.dataSourceDelete.filter = this.searchTextDelete.trim().toLowerCase();
  }

}



