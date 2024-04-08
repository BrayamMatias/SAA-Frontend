import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementAttendanceListComponent } from './management-attendance-list.component';

describe('ManagementAttendanceListComponent', () => {
  let component: ManagementAttendanceListComponent;
  let fixture: ComponentFixture<ManagementAttendanceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementAttendanceListComponent]
    });
    fixture = TestBed.createComponent(ManagementAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
