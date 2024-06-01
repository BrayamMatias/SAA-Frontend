import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearningUnitService } from 'src/app/services/management/learning-unit.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-management-learning-unit',
  templateUrl: './management-learning-unit.component.html',
  styleUrls: ['./management-learning-unit.component.css']
})
export class ManagementLearningUnitComponent implements OnInit {

  learningUnits: any[] = [];

  constructor(
    private router: Router,
    private _learnUnitService: LearningUnitService,
    private _sharedService: SharedService,
    private _sweetAlertService: SweetAlertService,
  ) { }

  ngOnInit(): void {
    this.getLearningUnits();
  }

  managementList(id: string, periodId: string) {
    this._sharedService.changePeriodId(periodId);
    this.router.navigate(['/management-list', id]);
  }

  getLearningUnits() {
    this._learnUnitService.getLearningUnits().subscribe((data) => {
      this.learningUnits = data.map((unit: any) => {
        if (unit.name) {
          unit.name = unit.name.replace(/-/g, ' ')
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
        return unit;
      });
    });
  }

  editLearningUnit(id: string) {
    this.router.navigate(['/edit-learning-unit', id]);
  }

  deleteLearningUnit(id: string) {
    this._sweetAlertService.showDeleteConfirmation().then((result) => {
      if (result.isConfirmed) {
        this._learnUnitService.deleteLearningUnit(id).subscribe(() => {
          this.getLearningUnits();
          this._sweetAlertService.showSuccessToast('Unidad de Aprendizaje eliminada correctamente');
        },
          (error) => {
            this._sweetAlertService.showErrorToast('Error al eliminar la Unidad de Aprendizaje');
          });
      }
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
