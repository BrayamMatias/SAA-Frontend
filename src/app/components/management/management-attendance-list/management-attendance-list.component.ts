import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendancesService } from 'src/app/services/management/attendances.service';

@Component({
  selector: 'app-management-attendance-list',
  templateUrl: './management-attendance-list.component.html',
  styleUrls: ['./management-attendance-list.component.css']
})
export class ManagementAttendanceListComponent implements OnInit {
    id:string;

    attendanceList: any[] = [];

    constructor(
      private router: Router,
      private aRouter: ActivatedRoute,
      private _attendanceService: AttendancesService

    ) {
      this.id = String(aRouter.snapshot.paramMap.get('id'));
    }
  
    ngOnInit(): void {
      this.getAttendances();
    }

    getAttendances(){
      this._attendanceService.getAttendances().subscribe( data => {
        console.log(data);
      });
    
    }

    managementStudent(){
      this.router.navigate(['/add-students', this.id]);
    }

    createAttendanceList(){
      this.router.navigate(['/add-attendance-list', this.id]);
    }

}
