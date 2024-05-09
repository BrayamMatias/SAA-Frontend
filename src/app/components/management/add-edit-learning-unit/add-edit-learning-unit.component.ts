import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, delay } from 'rxjs';
import { LearnUnit } from 'src/app/interfaces/learn-unit';
import { PeriodsService } from 'src/app/services/auth/periods.service';
import { LearningUnitService } from 'src/app/services/management/learning-unit.service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-add-edit-learning-unit',
  templateUrl: './add-edit-learning-unit.component.html',
  styleUrls: ['./add-edit-learning-unit.component.css']
})
export class AddEditLearningUnitComponent implements OnInit {

  id: string;
  operacion: string = 'Agregar';
  periods: any;

  formLearningUnit = this.fb.group({
    name: ['', Validators.required],
    period: ['', Validators.required],
    grade: ['', Validators.required],
    group: ['', Validators.required],
    daysGiven: this.fb.array([]),
    endTime: this.fb.array([])
  });

  selectedDays: string[] = [];
  selectedTime: string[] = [];

  step = 0;


  val_periods = ['Primavera 2024', 'Otoño 2024', 'Primavera 2025', 'Otoño 2025'];
  val_grades = ['1ro', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no'];
  val_groups = ['A', 'B', 'C'];
  val_days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  val_hours = ['12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private aRouter: ActivatedRoute,
    private _learnUnitService: LearningUnitService,
    private _sweetAlertService: SweetAlertService,
    private _periodService: PeriodsService
  ) {
    this.addDayAndTime();
    
    this.id = String(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    console.log(this.id);
    if (this.id !== 'null') {
      this.operacion = 'Actualizar';
      this.getLearningUnit(this.id);
    }
    this.getPeriods();
  }

  getPeriods(){
    this._periodService.getPeriods().subscribe(data => {
      console.log(data);
      this.periods = data;
    });
  }

  getLearningUnit(id: string) {
    this._learnUnitService.getLearningUnit(id).subscribe((data: LearnUnit ) => {
      console.log(data);
      this.formLearningUnit.patchValue({
        name: data.name,
        period: data.period,
        grade: data.grade,
        group: data.group,
      });
  
      // Clear the FormArrays
      const daysGivenControl = this.formLearningUnit.get('daysGiven') as FormArray;
      daysGivenControl.clear();
      const endTimeControl = this.formLearningUnit.get('endTime') as FormArray;
      endTimeControl.clear();
  
      // Set the values for the 'daysGiven' FormArray
      data.daysGiven.forEach(day => {
        daysGivenControl.push(this.fb.control(day));
      });
  
      // Set the values for the 'endTime' FormArray
      data.endTime.forEach(time => {
        endTimeControl.push(this.fb.control(time));
      });
    });
  }

  addLearningUnit() {
    let formValues = { ...this.formLearningUnit.value };
  
    if (this.id !== 'null') {
      //Es actualizar
      this._learnUnitService.updateLearningUnit(this.id, formValues as LearnUnit).subscribe(() => {
        this.router.navigate(['/home']);
        this._sweetAlertService.showSuccessToast('Unidad de aprendizaje actualizada con éxito');
      }, 
      (error) => {
        console.error('Error actualizando la unidad de aprendizaje', error);
        this._sweetAlertService.showErrorToast('Los datos coinciden con otra unidad de aprendizaje o hubo un error al actualizarla');
      });
    } else {
      //Es agregar
      this._learnUnitService.createLearningUnit(formValues as LearnUnit).subscribe(() => {
        this.router.navigate(['/home']);
        this._sweetAlertService.showSuccessToast('Unidad de aprendizaje creada con éxito');
      }, 
      (error) => {
        console.error('Error creando la unidad de aprendizaje', error);
        this._sweetAlertService.showErrorToast('La unidad de aprendizaje ya existe o hubo un error al crearla');
      });
    }
  }

  get daysGiven() {
    return this.formLearningUnit.get('daysGiven') as FormArray;
  }

  get endTime() {
    return this.formLearningUnit.get('endTime') as FormArray;
  }

  getDayControl(index: number): FormControl {
    return this.daysGiven.controls[index] as FormControl;
  }

  getTimeControl(index: number): FormControl {
    return this.endTime.controls[index] as FormControl;
  }

  addDayAndTime() {
    const index = this.daysGiven.length;
    const dayControl = this.fb.control('', Validators.required) as FormControl;
    const timeControl = this.fb.control('', [Validators.required, this.validateTimeNotRepeated(index)]) as FormControl;

    // Update validation when the day changes
    dayControl.valueChanges.subscribe(() => {
      timeControl.updateValueAndValidity();
    });

    this.daysGiven.push(dayControl);
    this.endTime.push(timeControl);
    this.selectedDays.push('');
    this.selectedTime.push('');
  }

  removeDayAndTime(index: number) {
    if (this.daysGiven.length > 1) {
      this.daysGiven.removeAt(index);
      this.endTime.removeAt(index);
      this.selectedDays.splice(index, 1);
      this.selectedTime.splice(index, 1);

      // Update validation for all time controls
      this.endTime.controls.forEach((control, i) => {
        control.setValidators([Validators.required, this.validateTimeNotRepeated(i)]);
        control.updateValueAndValidity();
      });
    }
  }

  validateTimeNotRepeated(index: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const invalid = this.daysGiven.controls.some((dayControl, i) => {
        const timeControl = this.getTimeControl(i);
        return i !== index && timeControl.value && timeControl.value === control.value && dayControl.value === this.getDayControl(index).value;
      });
      return invalid ? { 'timeRepeated': { value: control.value } } : null;
    };
  }

  submitForm() {
    if (this.formLearningUnit.valid) {
      console.log(this.formLearningUnit.value);
      this.addLearningUnit();
    }
  }


  setStep(index: number) {
    this.step = index;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}

