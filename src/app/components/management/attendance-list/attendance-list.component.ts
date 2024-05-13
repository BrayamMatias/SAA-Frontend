import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EnrollmentService } from 'src/app/services/management/enrollment.service';
import { ActivatedRoute } from '@angular/router';
import { AttendancesService } from 'src/app/services/management/attendances.service';


@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  attendanceArray: any;
  searchText: string = '';
  subjectId: string;
  displayedColumns: string[] = ['matricula', 'fullName', 'attendance'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private aRouter: ActivatedRoute,
    private _enrollmentService: EnrollmentService,
    private _attendanceService: AttendancesService
  ) {
    this.subjectId = String(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.getStudentAttendance();
  }

  getStudentAttendance() {
    this._enrollmentService.getEnrollments(this.subjectId).subscribe( data => {
      this.dataSource.data = data;
    });
  }

  getAttendanceArray() {
    this.attendanceArray = this.dataSource.data.map(student => ({
      enrollmentId: student.enrollmentId,
      attendance: student.attendance || 0
    }));
    return this.attendanceArray;
  }

  createAttendanceList() {
    const attendanceList = this.getAttendanceArray();
    this._attendanceService.createAttendance(attendanceList).subscribe( data => {
      console.log(data);
    });
  }

  applyFilterAdd() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.matricula.toLowerCase().includes(filter) || data.fullName.toLowerCase().includes(filter);
    };
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

}


