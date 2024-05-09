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
  dataPartial: FormGroup;
  operation: string = 'Registrar';

  dataPartials: any[] = [];
  dataPeriod: any;
  periods: any;
  partials: any;
  partialData: any;
  id: string;

  partial: Partial[] = [
    { partial: 'first', startDate: '', finishDate: '' },
    { partial: 'second', startDate: '', finishDate: '' },
    { partial: 'third', startDate: '', finishDate: '' },
  ];

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

    this.dataPeriod = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
    });

    this.dataPartial = this.fb.group({
      first: this.fb.group({
        startDate: ['', Validators.required],
        finishDate: ['', Validators.required],
      }),
      second: this.fb.group({
        startDate: ['', Validators.required],
        finishDate: ['', Validators.required],
      }),
      third: this.fb.group({
        startDate: ['', Validators.required],
        finishDate: ['', Validators.required],
      }),
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
      console.log(error);
    });
  }

  editPartial(id: string) {
    this.id = id;
    this.operation = 'Actualizar';
    this.getPartial(id);
  }

  getPartial(id: string) {
    this._partialService.getPartial(id).subscribe(data => {
      console.log(data);
      this.partialData = data;
      this.dataPeriod.reset();
      this.dataPeriod.setValue({
        id: this.partialData.period.id,
        name: this.partialData.period.name,
      });

      let partial = this.partialData.partial;
      if (['first', 'second', 'third'].includes(partial)) {

        this.dataPartial.reset();
        this.dataPartial.get(partial)?.enable();
        this.dataPartial.get(partial)?.setValue({
          startDate: this.partialData.startDate,
          finishDate: this.partialData.finishDate,
        });

        ['first', 'second', 'third'].forEach(key => {
          if (key !== partial) {
            this.dataPartial.get(key)?.disable();
          }
        });
      }
    }, (error) => {
      console.log(error);
    });
  }

  getPartials() {
    this._partialService.getPartials().subscribe(data => {
      this.partials = data;
      console.log(this.partials);
      this.dataSource.data = this.partials;
    }, (error) => {
      console.log(error);
    });
  }

  createDataPartial() {
    if (this.operation === 'Registrar') {
      if (this.dataPartial.valid) {
        const periodId = this.dataPeriod.get('id').value;
        console.log(periodId);
        this.dataPartials = Object.keys(this.dataPartial.value).map(key => {
          const startDate = this.dataPartial.value[key].startDate;
          const finishDate = this.dataPartial.value[key].finishDate;
          return {
            partial: key,
            startDate: startDate ? new Date(startDate).toISOString().slice(0, 10) : '',
            finishDate: finishDate ? new Date(finishDate).toISOString().slice(0, 10) : ''
          };
        });
        console.log(this.dataPartials);
        this._partialService.createPartial(periodId, this.dataPartials).subscribe(data => {
          this.dataPeriod.reset();
          this.dataPartial.reset();
          this.getPartials();
          this._sweetAlertService.showSuccessToast('Parcial creado exitosamente');
        }, (error) => {
          this._sweetAlertService.showErrorAlert('Ya existen parciales para este periodo');
        });
      }

    } else if (this.operation === 'Actualizar') {
      console.log('Actualizar');
      this.updatePartial();
    }
  }

  updatePartial() {
    if (this.dataPartial.valid) {
      var data = this.dataPartial.value;
      let firstKey = Object.keys(data)[0];
      var startDate = new Date(data[firstKey].startDate).toISOString().slice(0, 10);
      var finishDate = new Date(data[firstKey].finishDate).toISOString().slice(0, 10);
      var periodId = this.dataPeriod.get('id').value;
      console.log(periodId)

      let parcial = {
        period: periodId,
        startDate: startDate,
        finishDate: finishDate,  
      }

      this._partialService.updatePartial(this.id, parcial).subscribe(data => {
        this.dataPartial.reset();
        this.dataPeriod.reset();
        this.dataPartial.get('first')?.enable();
        this.dataPartial.get('second')?.enable();
        this.dataPartial.get('third')?.enable();
        this.operation = 'Registrar';
        this._sweetAlertService.showSuccessToast('Parcial actualizado exitosamente');
        this.getPartials();
        console.log(data);
      }, (error) => {
        this._sweetAlertService.showErrorToast('Ya existen parciales para este periodo');
      });
    }
  }

  deletePartial(id: string) {
    this._partialService.deletePartial(id).subscribe(data => {
      this.getPartials();
      this._sweetAlertService.showSuccessToast('Parcial eliminado exitosamente');
    }, (error) => {
      console.log(error);
    });
  }


  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

