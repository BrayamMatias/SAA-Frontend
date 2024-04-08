import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementLearningUnitComponent } from './management-learning-unit.component';

describe('ManagementLearningUnitComponent', () => {
  let component: ManagementLearningUnitComponent;
  let fixture: ComponentFixture<ManagementLearningUnitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementLearningUnitComponent]
    });
    fixture = TestBed.createComponent(ManagementLearningUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
