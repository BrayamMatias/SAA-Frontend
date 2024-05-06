import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Partial } from 'src/app/interfaces/partial';
import { PartialService } from 'src/app/services/auth/partial.service';
import { PeriodsService } from 'src/app/services/auth/periods.service';

@Component({
  selector: 'app-partial',
  templateUrl: './partial.component.html',
  styleUrls: ['./partial.component.css']
})

export class PartialComponent implements OnInit{
  dataPartial: FormGroup;

  data: any[] =[];
  
  // Define la propiedad 'partial'
  partial: Partial[] = [
    { partial: 'first', startDate: '', finishDate: '' },
    { partial: 'second', startDate: '', finishDate: '' },
    { partial: 'third', startDate: '', finishDate: '' },
  ];
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _partialService: PartialService,
    private _periodsService: PeriodsService
  ) {
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
  }

  ngOnInit(): void {
    this.getPeriods();
  }

  getPeriods() {
    this._periodsService.getPeriods().subscribe( data => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  createDataPartial() {
    if (this.dataPartial.valid) {
      this.data = Object.keys(this.dataPartial.value).map(key => {
        const startDate = this.dataPartial.value[key].startDate;
        const finishDate = this.dataPartial.value[key].endDate;
        return {
          partial: key,
          startDate: startDate ? new Date(startDate).toISOString().slice(0, 10) : '',
          finishDate: finishDate ? new Date(finishDate).toISOString().slice(0, 10) : ''
        };
      });
      this._partialService.createPartial(this.data).subscribe( data => {
        console.log(data);
      }, (error) => {
        console.log(error);
      });
    }

  }


  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}