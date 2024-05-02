import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Components
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { AddEditStudentComponent } from './components/management/add-edit-student/add-edit-student.component';
import { AddEditLearningUnitComponent } from './components/management/add-edit-learning-unit/add-edit-learning-unit.component';
import { ManagementLearningUnitComponent } from './components/management/management-learning-unit/management-learning-unit.component';
import { ManagementAttendanceListComponent } from './components/management/management-attendance-list/management-attendance-list.component';
import { AttendanceListComponent } from './components/management/attendance-list/attendance-list.component';
import { ManagementReportsComponent } from './components/management/management-reports/management-reports.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { RegisterStudentComponent } from './components/authentication/register-student/register-student.component';

//Modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    AddEditStudentComponent,
    AddEditLearningUnitComponent,
    ManagementLearningUnitComponent,
    ManagementAttendanceListComponent,
    AttendanceListComponent,
    ManagementReportsComponent,
    RegisterStudentComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
