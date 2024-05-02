import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

    ) {
      this.id = String(aRouter.snapshot.paramMap.get('id'));
    }
  
    ngOnInit(): void {
    }

    managementStudent(){
      this.router.navigate(['/add-students', this.id]);
    }

}
