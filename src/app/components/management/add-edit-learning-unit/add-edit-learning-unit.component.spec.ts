import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLearningUnitComponent } from './add-edit-learning-unit';

describe('AddEditLearningUnitComponent', () => {
  let component: AddEditLearningUnitComponent;
  let fixture: ComponentFixture<AddEditLearningUnitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditLearningUnitComponent]
    });
    fixture = TestBed.createComponent(AddEditLearningUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
