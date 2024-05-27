import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Partial } from 'src/app/interfaces/partial';
import { PartialService } from 'src/app/services/auth/partial.service';
import { PeriodsService } from 'src/app/services/auth/periods.service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-partial',
  templateUrl: './partial.component.html',
  styleUrls: ['./partial.component.css']
})

export class PartialComponent implements OnInit {
  partialForm: FormGroup;
  periodForm: any;
  operation: string = 'Registrar';
  searchText: string = '';

  partial = {
    'first': 'Primero',
    'second': 'Segundo',
    'third': 'Tercero',
    // Agrega más parciales aquí según sea necesario
  };

  dataPartials: any[] = [];
  periods: any;
  partials: any;
  partialData: any;
  id: string;

  displayedColumns: string[] = ['period', 'partial', 'startDate', 'finishDate', 'accion'];
  dataSource = new MatTableDataSource<Partial>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private aRouter: ActivatedRoute,
    private _partialService: PartialService,
    private _periodsService: PeriodsService,
    private _sweetAlertService: SweetAlertService,
  ) {

    this.periodForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
    });

    this.partialForm = this.fb.group({
        partial: ['', Validators.required],
        startDate: ['', Validators.required],
        finishDate: ['', Validators.required]
      });

    this.id = aRouter.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {

    if (this.id != '') {
      this.operation = 'Actualizar';
      this.getPartial(this.id);
    }
    this.getPeriods();
    this.getPartials();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPeriods() {
    this._periodsService.getPeriods().subscribe(data => {
      this.periods = data;
    }, (error) => {
      this._sweetAlertService.showErrorToast('Error obteniendo los periodos');
    });
  }

  editPartial(id: string) {
    this.id = id;
    this.operation = 'Actualizar';
    this.getPartial(id);
  }

  getPartial(id: string) {
    this._partialService.getPartial(id).subscribe(data => {
      this.partialData = data;
      this.periodForm.reset();
      this.periodForm.setValue({
        id: this.partialData.period.id,
        name: this.partialData.period.name,
      });
  
      var startDate = new Date(this.partialData.startDate);
      startDate.setDate(startDate.getDate() + 1);
      var startDateString = startDate.toISOString().split('T')[0];
  
      var finishDate = new Date(this.partialData.finishDate);
      finishDate.setDate(finishDate.getDate() + 1);
      var finishDateString = finishDate.toISOString().split('T')[0];
  
      this.partialForm.setValue({
        partial: this.partialData.partial,
        startDate: startDateString,
        finishDate: finishDateString,
      });
    }, (error) => {
      this._sweetAlertService.showErrorToast('Error obteniendo el parcial');
    });
  }

  getPartials() {
    this._partialService.getPartials().subscribe(data => {
      this.partials = data;
      this.dataSource.data = this.partials;
    }, (error) => {
      this._sweetAlertService.showErrorToast('Error obteniendo los parciales');
    });
  }

  createDataPartial() {
    if (this.operation === 'Registrar') {
      if (this.partialForm.valid) {
        const periodId = this.periodForm.get('id').value;
        var startDate = new Date(this.partialForm.value.startDate);
        startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
        var startDateString = startDate.toISOString().slice(0, 10);
  
        var finishDate = new Date(this.partialForm.value.finishDate);
        finishDate.setMinutes(finishDate.getMinutes() - finishDate.getTimezoneOffset());
        var finishDateString = finishDate.toISOString().slice(0, 10);
  
        let data = {
          period: periodId,
          partial: this.partialForm.value.partial,
          startDate: startDateString,
          finishDate: finishDateString,
        }
        this._partialService.createPartial(data).subscribe(data => {
          this.periodForm.reset();
          this.partialForm.reset();
          this.getPartials();
          this._sweetAlertService.showSuccessToast('Parcial creado exitosamente');
        }, (error) => {
          this._sweetAlertService.showErrorAlert(error.error.message);
        });
      }
  
    } else if (this.operation === 'Actualizar') {
      this.updatePartial();
    }
  }

  updatePartial() {
    if (this.partialForm.valid) {
      const periodId = this.periodForm.get('id').value;
      var startDate = new Date(this.partialForm.value.startDate);
      startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
      var startDateString = startDate.toISOString().slice(0, 10);
  
      var finishDate = new Date(this.partialForm.value.finishDate);
      finishDate.setMinutes(finishDate.getMinutes() - finishDate.getTimezoneOffset());
      var finishDateString = finishDate.toISOString().slice(0, 10);
  
      let data = {
        period: periodId,
        partial: this.partialForm.value.partial,
        startDate: startDateString,
        finishDate: finishDateString,
      }
      this._partialService.updatePartial(this.id, data).subscribe(data => {
        this.partialForm.reset();
        this.periodForm.reset();
        this.operation = 'Registrar';
        this._sweetAlertService.showSuccessToast('Parcial actualizado exitosamente');
        this.getPartials();
      }, (error) => {
        this._sweetAlertService.showErrorToast('Ya existen parciales para este periodo');
      });
    }
  }

  deletePartial(id: string) {
    this._sweetAlertService.showMessageConfirmation('Todos los elementos asociados a este parcial serán eliminados en cascada; esta acción no podrá revertirse.').then(result => {
      if(result.isConfirmed){
        this._partialService.deletePartial(id).subscribe(data => {
          this.getPartials();
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
      return data.partial.toLowerCase().includes(filter) || data.period.name.toLowerCase().includes(filter);
    };
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

