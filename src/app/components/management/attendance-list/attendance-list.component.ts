import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  searchText: string = '';
  displayedColumns: string[] = ['enrollment', 'name', 'attendance'];
  labelPosition: 'full' | 'half' | 'quarter' | 'none' = 'full';
  dataSource = new MatTableDataSource<Student>();
  
  constructor() { }

  ngOnInit(){
    const students: Student[] = [
      { enrollment: '20206677', name: 'Brayam García Matías', attendance: 'half'},
      { enrollment: '2', name: 'User 2', attendance: 'none'},
      // Más estudiantes aquí...
   ];

    this.dataSource = new MatTableDataSource(students);
  }

  applyFilterAdd() {
    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      return data.enrollment.toLowerCase().includes(filter) || data.name.toLowerCase().includes(filter);
    };
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

}

export interface Student {
  enrollment: string;
  name: string;
  attendance: 'full' | 'half' | 'quarter' | 'none';
}

