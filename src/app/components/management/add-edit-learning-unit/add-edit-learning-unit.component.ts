import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnUnit } from 'src/app/interfaces/learn-unit';
import { LearningUnitService } from 'src/app/services/learning-unit.service';

@Component({
  selector: 'app-add-edit-learning-unit',
  templateUrl: './add-edit-learning-unit.component.html',
  styleUrls: ['./add-edit-learning-unit.component.css']
})
export class AddEditLearningUnitComponent implements OnInit {

  id: number;
  //user = JSON.parse(localStorage.getItem('user') || '');
  //userId = this.user ? this.user.id : undefined;

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
  val_grades = ['1er', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no'];
  val_groups = ['A', 'B', 'C'];
  val_days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  val_hours = ['12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _learnUnitService: LearningUnitService,
    private aRouter: ActivatedRoute,) {

    this.addDayAndTime();
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {

  }

  getLearningUnit(id: string) {
    this._learnUnitService.getLearningUnit(id).subscribe((data: LearnUnit ) => {
      console.log(data);
      this.formLearningUnit.patchValue({
        name: data.name,
        period: data.period,
        grade: data.grade,
        group: data.group,
        daysGiven: data.daysGiven,
        endTime: data.endTime,
      });
    });
  }

  addLearningUnit() {
    let formValues = { ...this.formLearningUnit.value };
  
    if (formValues.daysGiven) {
      formValues.daysGiven = formValues.daysGiven.map((control: any) => control.value);
    } else {
      formValues.daysGiven = [];
    }
  
    if (formValues.endTime) {
      formValues.endTime = formValues.endTime.map((control: any) => control.value);
    } else {
      formValues.endTime = [];
    }
  
    if (this.id !== 0) {
      this._learnUnitService.updateLearningUnit(this.id.toString(), formValues as LearnUnit).subscribe(data => {
        this.router.navigate(['/home']);
      });
    } else {
      //Es agregar
      this._learnUnitService.createLearningUnit(formValues as LearnUnit).subscribe(data => {
        this.router.navigate(['/home']);
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

