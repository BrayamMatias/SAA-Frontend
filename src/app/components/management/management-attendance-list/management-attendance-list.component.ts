import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendancesService } from 'src/app/services/management/attendances.service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-management-attendance-list',
  templateUrl: './management-attendance-list.component.html',
  styleUrls: ['./management-attendance-list.component.css']
})
export class ManagementAttendanceListComponent implements OnInit {
    id:string;
    periodId: string;
    datesArray: any;

    attendanceList: any[] = [];

    constructor(
      private router: Router,
      private aRouter: ActivatedRoute,
      private _attendanceService: AttendancesService,
      private _sweetAlertService: SweetAlertService,

    ) {
      this.id = String(aRouter.snapshot.paramMap.get('id'));
    }
  
    ngOnInit(): void {
      this.getAttendances();
    }

    getAttendances(){
      this._attendanceService.getAttendances(this.id).subscribe( data => {
        this.datesArray = data;
      }, (error) => {
        this._sweetAlertService.showErrorToast('Error al obtener las listas de asistencia');
      });
    }

    managementStudent(){
      this.router.navigate(['/add-students', this.id]);
    }

    createAttendanceList(){
      this.router.navigate(['/add-attendance-list', this.id]);
    }

    editAttendanceList(date: string){
      this.router.navigate(['/edit-attendance-list', this.id, date]);
    }

    managementReports(){
      this.router.navigate(['/management-reports', this.id]);
    }

    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }

}
