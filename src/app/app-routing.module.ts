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


const routes: Routes = [

  //---Default---
  {path: '', component: LoginComponent},
  //---Authentication---
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'register/:id', component: RegisterComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  
  //---Management---

  //Students
  { path: 'add-students', component: AddEditStudentComponent},
  { path: 'edit-students/:id', component: AddEditStudentComponent},
  //Learning Units
  { path: 'add-learning-unit', component: AddEditLearningUnitComponent},
  { path: 'adit-learning-unit/:id', component: AddEditLearningUnitComponent},
  //Learning Units
  { path: 'home', component: ManagementLearningUnitComponent},
  //Attendance
  { path: 'management-list', component: ManagementAttendanceListComponent},
  { path: 'attendance-list', component: AttendanceListComponent},
  //Reports
  { path: 'management-reports', component: ManagementReportsComponent},

  //Activar cuando este conectado con el backend

  // //---Authentication---
  // { path: 'login', component: LoginComponent, canActivate: [LoginGuardService]},
  // { path: 'register', component: RegisterComponent, canActivate: [AdminGuardService]},
  // { path: 'register/:id', component: RegisterComponent},
  // { path: 'forgot-password', component: ForgotPasswordComponent},
  
  // //---Management---

  // //Students
  // { path: 'add-students', component: AddEditStudentComponent, canActivate: [UserGuardService]},
  // { path: 'edit-students/:id', component: AddEditStudentComponent, canActivate: [UserGuardService]},
  // //Learning Units
  // { path: 'add-learning-unit', component: AddEditLearningUnitComponent, canActivate: [UserGuardService]},
  // { path: 'adit-learning-unit/:id', component: AddEditLearningUnitComponent, canActivate: [UserGuardService]},
  // //Learning Units
  // { path: 'home', component: ManagementLearningUnitComponent, canActivate: [UserGuardService]},
  // //Attendance
  // { path: 'management-list', component: ManagementAttendanceListComponent, canActivate: [UserGuardService]},
  // { path: 'attendance-list', component: AttendanceListComponent, canActivate: [UserGuardService]},
  // //Reports
  // { path: 'management-reports', component: ManagementReportsComponent, canActivate: [UserGuardService]},

  //any other path
  { path: '**', redirectTo: 'login'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
