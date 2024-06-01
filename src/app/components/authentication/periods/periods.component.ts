import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Periods } from 'src/app/interfaces/periods';
import { PeriodsService } from 'src/app/services/auth/periods.service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.html',
  styleUrl: './periods.component.css'
})
export class PeriodsComponent implements OnInit{
  searchText: string = '';
  formPeriod: FormGroup;
  operation: string = 'Registrar';
  id: string;

  periods: any;
  periodData: any;

  periods_values = ['Primavera', 'Otoño'];

  displayedColumns: string[] = ['name', 'accion'];
  dataSource = new MatTableDataSource<Periods>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private aRouter: ActivatedRoute,
    private fb: FormBuilder,
    private _periodsService: PeriodsService,
    private _sweetAlertService: SweetAlertService
  ) {
    this.formPeriod = this.fb.group({
      name: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)])
    });

    this.id = aRouter.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if(this.id != ''){
      this.operation = 'Actualizar';
      this.getPeriod(this.id);
    }
    this.getPeriods();
  }

  editPeriod(id: string){
    this.id = id;
    this.operation = 'Actualizar';
    this.getPeriod(id);
  }

  getPeriod(id: string){
    this._periodsService.getPeriod(id).subscribe( data => {
      this.periodData = data;
      let [name, year] = this.periodData.name.split(' ');
      this.formPeriod.setValue({
        name: name,
        year: year
      })
    })
  }

  getPeriods(){
    this._periodsService.getPeriods().subscribe( data => {
      this.periods = data;
      this.dataSource.data = this.periods;
    }, (error) => {
      this._sweetAlertService.showErrorToast(error.error.message);
    })
  }

  createPeriod(){
    let period = {
      name: `${this.formPeriod.value.name} ${this.formPeriod.value.year}`
    }
    if(this.operation === 'Registrar'){
      if(this.formPeriod.valid){
        this._periodsService.createPeriod(period).subscribe(data => {
          this.getPeriods();
          this.formPeriod.reset();
          this._sweetAlertService.showSuccessAlert('Periodo creado correctamente');
        }, (error) => {
          this._sweetAlertService.showErrorAlert('El periodo ya existe o hubo un error creando el periodo');
        })
      }
    }else if(this.operation === 'Actualizar'){
      if(this.formPeriod.valid){
        this._periodsService.updatePeriod(this.id, period).subscribe(data => {
          this.getPeriods();
          this.formPeriod.reset();
          this.operation = 'Registrar';
          this._sweetAlertService.showSuccessToast('Periodo actualizado correctamente');
        }, (error) => {
          this._sweetAlertService.showErrorAlert('El periodo ya existe o hubo un error actualizando el periodo');
        })
      }
    }
  }

  deletePeriod(id: string) {
    this._sweetAlertService.showMessageConfirmation('Todos los elementos asociados a este periodo serán eliminados en cascada; esta acción no podrá revertirse.').then(result => {
      if(result.isConfirmed){
        this._periodsService.deletePeriod(id).subscribe(data => {
          this.getPeriods();
          this._sweetAlertService.showSuccessToast('Parcial eliminado exitosamente');
        }, 
        (error) => {
          this._sweetAlertService.showErrorToast('Error eliminando el parcial');
        });
      }
    });
}

  applyFilter() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }
  
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
