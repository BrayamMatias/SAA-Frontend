import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Student } from 'src/app/interfaces/student';
import { StudentService } from 'src/app/services/auth/student.service';
import { EnrollmentService } from 'src/app/services/management/enrollment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.css']
})
export class AddEditStudentComponent implements OnInit {
  selectedStudentsAdd: Student[] = [];
  selectedStudentsDelete: Student[] = [];
  subjectId: string;
  searchTextAdd: string = '';
  searchTextDelete: string = '';
  displayedColumns: string[] = ['selected', 'matricula', 'nombre', 'accion'];

  length = 100;

  pageSizeOptionsAdd = [5, 10, 25];
  pageIndexAdd = 0;
  pageSizeAdd = 10;
  showFirstLastButtonsAdd = true;


  pageSizeOptionsDelete = [5, 10, 25];
  pageIndexDelete = 0;
  pageSizeDelete = 10;
  showFirstLastButtonsDelete = true;


  pageEventAdd: PageEvent;
  pageEventDelete: PageEvent;

  // DataSource y ViewChild para la primera tabla (Añadir Estudiantes)
  dataSourceAdd = new MatTableDataSource<Student>();

  // DataSource y ViewChild para la segunda tabla (Eliminar Estudiantes)
  dataSourceDelete = new MatTableDataSource<Student>();

  constructor(
    private aRouter: ActivatedRoute,
    private router: Router,
    private _studentService: StudentService,
    private _enrollmentService: EnrollmentService,
    private _sweetAlert: SweetAlertService

  ) {
    this.subjectId = String(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
    this.getNotEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
  }
  ngAfterViewInit(): void {
    this.getEnrolledStudents(this.pageIndexAdd * this.pageSizeAdd, this.pageSizeAdd);
    this.getNotEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
  }

  handelPageEventAdd(pageEventAdd: PageEvent){
    this.length = pageEventAdd.length;
    this.pageIndexAdd = pageEventAdd.pageIndex;
    this.pageSizeAdd = pageEventAdd.pageSize;
    this.getNotEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
  }

  handelPageEventDelete(pageEventDelete: PageEvent){
    this.length = pageEventDelete.length;
    this.pageIndexDelete = pageEventDelete.pageIndex;
    this.pageSizeDelete = pageEventDelete.pageSize;
    this.getEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
  }

  onCheckboxChangeAdd(student: Student, isChecked: boolean) {
    if (isChecked) {
      this.selectedStudentsAdd.push(student);
    } else {
      const index = this.selectedStudentsAdd.indexOf(student);
      if (index >= 0) {
        this.selectedStudentsAdd.splice(index, 1);
      }
    }
  }

  onCheckboxChangeDelete(student: Student, isChecked: boolean) {
    if (isChecked) {
      this.selectedStudentsDelete.push(student);
    } else {
      const index = this.selectedStudentsDelete.indexOf(student);
      if (index >= 0) {
        this.selectedStudentsDelete.splice(index, 1);
      }
    }
  }

  deselectAllStudents() {
    this.selectedStudentsAdd = [];
    this.selectedStudentsDelete = [];
  }

 getEnrolledStudents(offset: number, limit: number) {
  this._enrollmentService.getEnrollmentspaginated(this.subjectId, limit, offset).subscribe(data => {
    this.dataSourceDelete.data = data;
  });
 }

  getNotEnrolledStudents(offset: number, limit: number) {
    this._enrollmentService.getNotEnrolledStudents(this.subjectId,limit, offset).subscribe(data => {
      this.dataSourceAdd.data = data;
    });
  }

  createEnrollment(studentId: string[]) {
    if (!Array.isArray(studentId)) {
      studentId = [studentId];
    }
    let enrollments = (studentId as string[]).map(id => ({
      studentId: id
    }));

    this._enrollmentService.createEnrollment(this.subjectId, enrollments).subscribe(data => {
      this.getEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
      this.getNotEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
      this.deselectAllStudents();
      this._sweetAlert.showSuccessToast('Estudiante añadido correctamente');
    }, error => {
      this._sweetAlert.showErrorAlert('El estudiante ya esta inscrito en la materia');
    });
  }

  createEnrollments(students: Student[]) {
    let enrollments = students.filter(student => student.id !== undefined)
      .map(student => ({
        studentId: student.id!
      }));

    this._enrollmentService.createEnrollment(this.subjectId, enrollments).subscribe(data => {
      this.getEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
      this.getNotEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
      this.deselectAllStudents();
      this._sweetAlert.showSuccessToast('Estudiantes añadidos correctamente');
    }, error => {
      this._sweetAlert.showErrorAlert('Uno o mas estudiantes ya estan inscritos en la materia');
    });
  }

  deleteEnrollment(enrollmentId: string) {
    this._sweetAlert.showDeleteConfirmation()
      .then((result) => {
        if (result.value) {
          let enrollment = [{
            enrollmentId: enrollmentId
          }];
  
          this._enrollmentService.deleteEnrollments(enrollment).subscribe(data => {
            this.getEnrolledStudents(this.pageIndexAdd * this.pageSizeAdd, this.pageSizeAdd);
            this.getNotEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
            this.deselectAllStudents();
            this._sweetAlert.showSuccessToast('Estudiante eliminado correctamente');
          }, error => {
            this._sweetAlert.showErrorAlert('Error al eliminar al estudiante');
          });
        }
      });
  }

  deleteEnrollments(students: Student[]) {
    this._sweetAlert.showDeleteConfirmation()
      .then((result) => {
        if (result.value) {
          let enrollments = students.filter(student => student.enrollmentId !== undefined)
            .map(student => ({
              enrollmentId: student.enrollmentId!
            }));
          this._enrollmentService.deleteEnrollments(enrollments).subscribe(data => {
            this.getEnrolledStudents(this.pageIndexAdd * this.pageSizeAdd, this.pageSizeAdd);
            this.getNotEnrolledStudents(this.pageIndexDelete * this.pageSizeDelete, this.pageSizeDelete);
            this.deselectAllStudents();
            this._sweetAlert.showSuccessToast('Estudiantes eliminados correctamente');
          }, error => {
            this._sweetAlert.showErrorAlert('Error al eliminar a los estudiantes');
          });
        }
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

  back() {
    this.router.navigate(['/management-list', this.subjectId]);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}



