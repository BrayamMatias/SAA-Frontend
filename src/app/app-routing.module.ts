import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Guardian de rutas
import { AdminGuardService } from './services/admin-guard.service';
import { UserGuardService } from './services/user-guard.service';


//Components
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { AddEditStudentComponent } from './components/management/add-edit-student/add-edit-student.component';
import { AddEditLearningUnitComponent } from './components/management/add-edit-learning-unit/add-edit-learning-unit.component';
import { ManagementLearningUnitComponent } from './components/management/management-learning-unit/management-learning-unit.component';
import { ManagementAttendanceListComponent } from './components/management/management-attendance-list/management-attendance-list.component';
import { AttendanceListComponent } from './components/management/attendance-list/attendance-list.component';
import { ManagementReportsComponent } from './components/management/management-reports/management-reports.component';
import { LoginGuardService } from './services/login-guard.service';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { RegisterStudentComponent } from "./components/authentication/register-student/register-student.component";


const routes: Routes = [

  //---Authentication---
  { path: 'login', component: LoginComponent, canActivate: [LoginGuardService]},
  { path: 'register', component: RegisterComponent, canActivate: [AdminGuardService]},
  { path: 'register/:id', component: RegisterComponent, canActivate: [AdminGuardService]},
  { path: 'register-student', component: RegisterStudentComponent,canActivate: [AdminGuardService]},
  { path: 'register-student/:id', component: RegisterStudentComponent,canActivate: [AdminGuardService]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [LoginGuardService]},
  
  //---Management---

  //Students
  { path: 'add-students/:id', component: AddEditStudentComponent, canActivate: [UserGuardService]},
  //Learning Units
  { path: 'add-learning-unit', component: AddEditLearningUnitComponent, canActivate: [UserGuardService]},
  { path: 'edit-learning-unit/:id', component: AddEditLearningUnitComponent, canActivate: [UserGuardService]},
  //Learning Units
  { path: 'home', component: ManagementLearningUnitComponent, canActivate: [UserGuardService]},
  //Attendance
  { path: 'management-list/:id', component: ManagementAttendanceListComponent, canActivate: [UserGuardService]},
  { path: 'attendance-list', component: AttendanceListComponent, canActivate: [UserGuardService]},
  //Reports
  { path: 'management-reports', component: ManagementReportsComponent, canActivate: [UserGuardService]},

  //any other path
  { path: '**', redirectTo: 'login'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
