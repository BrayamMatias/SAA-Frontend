import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EnrollmentService } from 'src/app/services/management/enrollment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendancesService } from 'src/app/services/management/attendances.service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';


@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  attendanceArray: any;
  attendanceByDate: any;
  searchText: string = '';
  operation: string = 'Registrar';
  subjectId: string;
  date: string;
  length: number;
  displayedColumns: string[] = ['matricula', 'fullName', 'attendance'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private router: Router,
    private aRouter: ActivatedRoute,
    private _enrollmentService: EnrollmentService,
    private _attendanceService: AttendancesService,
    private _sweetAlertService: SweetAlertService
  ) {
    this.subjectId = String(aRouter.snapshot.paramMap.get('id'));
    this.date = String(aRouter.snapshot.paramMap.get('date'));
  }

  ngOnInit() {
    if (this.subjectId && this.date != 'null') {
      //Editar
      this.operation = 'Editar';
      this.getCountEnrollments();
      this.getAttendanceByDate();
    }
    if (this.subjectId && this.date == 'null') {
      //Crear
      this.getCountEnrollments();
    }
  }
  
  getCountEnrollments() {
    this._enrollmentService.getCountEnrollments(this.subjectId).subscribe((data:any) => {
      this.length = data.count;
      if (this.date == 'null') {
        this.getStudentAttendance(this.length, 0);
      }
    });
  }

  getStudentAttendance(limit, offset) {
    this._enrollmentService.getEnrollmentspaginated(this.subjectId,limit, offset).subscribe(data => {
      this.dataSource.data = data;
      this.attendanceArray = data.map(student => ({
        enrollmentId: student.enrollmentId,
        attendance: 0
      }));
    });
  }

  getAttendanceByDate() {
    this._attendanceService.getAttendanceByDate(this.subjectId, this.date).subscribe(dataDate => {
      this.dataSource.data = (dataDate as any[]).map(item => item.student);
      this.attendanceArray = (dataDate as any[]).map(item => ({ id: item.id, attendance: +item.attendance }));
      this.attendanceByDate = dataDate;
    });
  }

  createAttendance() {
    if (this.operation == 'Registrar') {
      this._attendanceService.createAttendance(this.attendanceArray).subscribe(data => {
        this._sweetAlertService.showSuccessToast('Asistencia registrada correctamente');
        this.router.navigate(['/management-list', this.subjectId])
      }, (error) => {
        this._sweetAlertService.showErrorAlert(error.error.message);
      });
    }

    if (this.operation == 'Editar') {
      this._attendanceService.updateAttendance(this.attendanceArray).subscribe(data => {
        this._sweetAlertService.showSuccessToast('Asistencia actualizada correctamente');
        this.router.navigate(['/management-list', this.subjectId])
      }, (error) => {
        this._sweetAlertService.showErrorToast('Error al actualizar la asistencia');
      });
    }
  }

  applyFilterAdd() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.matricula.toLowerCase().includes(filter) || data.fullName.toLowerCase().includes(filter);
    };
    this.dataSource.filter = this.searchText.trim().toLowerCase();
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


