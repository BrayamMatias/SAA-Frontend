import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Periods } from 'src/app/interfaces/periods';
import { PeriodsService } from 'src/app/services/auth/periods.service';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.html',
  styleUrl: './periods.component.css'
})
export class PeriodsComponent implements OnInit{
  formPeriod: FormGroup;
  displayedColumns: string[] = ['name', 'accion'];
  dataSource = new MatTableDataSource<Periods>
  operation: string = 'Registrar';
  id: string;

  periods = ['Primavera', 'Otoño'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private aRouter: ActivatedRoute,
    private fb: FormBuilder,
    private _periodsService: PeriodsService
  ) {
    this.formPeriod = this.fb.group({
      name: ['', Validators.required],
      year: ['', Validators.required]
    });

    this.id = aRouter.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if(this.id != ''){
      this.operation = 'Actualizar';
    }
  }

  getPeriods(){
    this._periodsService.getPeriods().subscribe( data => {
      console.log(data);
    }, (error) => {
      console.log(error);
    })
  }

  createPeriod(){
    let period = {
      name: `${this.formPeriod.value.name} ${this.formPeriod.value.year}`
    }
    
    this._periodsService.createPeriod(period).subscribe(data => {
      console.log(data)
    })
  }

  

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
