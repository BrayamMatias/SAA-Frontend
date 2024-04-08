import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  displayedColumns: string[] = ['enrollment', 'name', 'attendance'];
  labelPosition: 'full' | 'half' | 'quarter' | 'none' = 'full';
  dataSource = new MatTableDataSource<Student>();
  
  constructor() { }

  ngOnInit(){
    const students: Student[] = [
      { enrollment: '1', name: 'User 1'},
      { enrollment: '2', name: 'User 2'},
      // Más estudiantes aquí...
    ];

    this.dataSource = new MatTableDataSource(students);
  }

}
export interface Student {
  enrollment: string;
  name: string;
}

