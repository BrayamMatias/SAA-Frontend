import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.css']
})
export class AddEditStudentComponent implements OnInit {
  searchTextAdd: string = '';
  searchTextDelete: string = '';
  displayedColumns: string[] = ['matricula', 'nombre', 'accion'];

  // DataSource y ViewChild para la primera tabla (Añadir Estudiantes)
  dataSourceAdd = new MatTableDataSource<Student>();
  @ViewChild('paginatorAdd') paginatorAdd!: MatPaginator;

  // DataSource y ViewChild para la segunda tabla (Eliminar Estudiantes)
  dataSourceDelete = new MatTableDataSource<Student>();
  @ViewChild('paginatorDelete') paginatorDelete!: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    const studentsAdd: Student[] = [
      { matricula: '20206677', nombre: 'Brayam García Matías' },
      { matricula: '33333', nombre: 'Usuario 3' },
      { matricula: '444441', nombre: 'Usuario 4'},
      { matricula: '444442', nombre: 'Usuario 4'},
      { matricula: '444443', nombre: 'Usuario 4'},
      { matricula: '444444', nombre: 'Usuario 4'},
      { matricula: '444445', nombre: 'Usuario 4'},
      { matricula: '444446', nombre: 'Usuario 4'},
      { matricula: '444447', nombre: 'Usuario 4'},
      { matricula: '444448', nombre: 'Usuario 4'}

    ];
    this.dataSourceAdd = new MatTableDataSource(studentsAdd);

    // Datos para la segunda tabla (Eliminar Estudiantes)
    const studentsDelete: Student[] = [
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },
      { matricula: '22222', nombre: 'Usuario 2' },

    ];

    this.dataSourceDelete = new MatTableDataSource(studentsDelete);

  }
  ngAfterViewInit(): void{
    this.dataSourceAdd.paginator = this.paginatorAdd;
    this.dataSourceDelete.paginator = this.paginatorDelete;
  }

  applyFilterAdd() {
    this.dataSourceAdd.filterPredicate = (data: Student, filter: string) => {
      return data.matricula.toLowerCase().includes(filter) || data.nombre.toLowerCase().includes(filter);
    };
    this.dataSourceAdd.filter = this.searchTextAdd.trim().toLowerCase();
  }
  
  applyFilterDelete() {
    this.dataSourceDelete.filterPredicate = (data: Student, filter: string) => {
      return data.matricula.toLowerCase().includes(filter) || data.nombre.toLowerCase().includes(filter);
    };
    this.dataSourceDelete.filter = this.searchTextDelete.trim().toLowerCase();
  }

}

export interface Student {
  matricula: string;
  nombre: string;
}

