import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningUnitService } from 'src/app/services/management/learning-unit.service';
import { ReportsService } from 'src/app/services/management/reports.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-management-reports',
  templateUrl: './management-reports.component.html',
  styleUrls: ['./management-reports.component.css']
})
export class ManagementReportsComponent implements OnInit {
  id: string;
  periodId: string;
  data: any;

  nameSubject: string;
  grade: string;
  group: string;
  period: any;

  datesArray: any;
  studentsArray: any;
  attendanceArray: any;
  attendanceByDate: any;
  totalAttendance: any;
  percentageAttendance: any;

  firstPartial: any;
  secondPartial: any;
  thirdPartial: any;

  constructor(
    private router: Router,
    private aRouter: ActivatedRoute,
    private _learningUnitService: LearningUnitService,
    private _reportService: ReportsService,
    private _sharedService: SharedService,
    private _cookieService: CookieService,
    private _sweetAlertService: SweetAlertService,
  ) {
    this.id = String(aRouter.snapshot.paramMap.get('id'));
  }

  async getPartials() {
    try {
      this.data = await this._learningUnitService.getPartialsBySubject(this.id);
      if (this.data.length != 3) {
        this._sweetAlertService.showErrorToast('Para continuar deben existir los tres parciales');
        return this.back();
      }
      this.firstPartial = this.data[0];
      this.secondPartial = this.data[1];
      this.thirdPartial = this.data[2];
    } catch (error) {
      this._sweetAlertService.showErrorToast('Error al obtener los parciales');
    }
  }

  async getSubjectData() {
    try {
      await this._learningUnitService.getLearningUnit(this.id).subscribe((data: any) => {
        this.nameSubject = data.name.replace(/-/g, ' ')
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        this.grade = data.grade;
        this.group = data.group;
        this.period = data.period.name;
      });
    } catch (error) {
      this._sweetAlertService.showErrorToast('Error al obtener los datos de la materia');
    }
  }

  async ngOnInit() {
    await this.getPartials();
    await this.getSubjectData();
    this._sharedService.currentPeriodId.subscribe(periodId => {
      this.periodId = periodId || this._cookieService.get('periodId');
    });
  }

  createPdf() {
    const pdfDefinition: any = {
      content: [
        {
          text: 'Reporte de asistencias',
        }
      ]
    }
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download();
  }

  getReportByPartial(partial) {
    let namePartial;
    if(partial == this.firstPartial) {
      namePartial = 'primer';
    }
    if(partial == this.secondPartial) {
      namePartial = 'segundo';
    }
    if(partial == this.thirdPartial) {
      namePartial = 'tercer';
    }

    let startDate = partial.startDate;
    let finishDate = partial.finishDate;
    
    this._reportService.getReportByPartial(this.id, startDate, finishDate).subscribe((data: any) => {
      if (data == null || data == undefined || data == '' || (data.students && data.students.length === 0)) {
        this._sweetAlertService.showErrorToast('No se encontraron datos');
      } else {
        this.totalAttendance = data.totalAttendances;
        this.datesArray = data.students.map(studentData => studentData.attendances.map(attendance => attendance.createdAt));
        this.studentsArray = data.students.map(studentData => studentData.student);
        this.attendanceArray = data.students.map(studentData => studentData.attendances);
        this.attendanceByDate = data.students.map(studentData => studentData.attendances.map(attendance => attendance.attendance));
        this.percentageAttendance = data.students.map(studentData => studentData.averageAttendance);
        
        this.generateReportPartial(startDate, finishDate, this.nameSubject, this.grade, this.group, this.period, namePartial);
        this._sweetAlertService.showSuccessToast('Reporte generado correctamente');
      }
    }, (error) => {
      this._sweetAlertService.showErrorToast('Error al obtener el reporte');
    });
  }

  generateReportPartial(startDate, finishDate, nameSubject, grade, group, period, namePartial) {
    const dates = this.datesArray[0];
    const groupedDates = this.groupByDate(dates);
    const students = this.studentsArray.map(student => student.fullName);
    const matriculas = this.studentsArray.map(student => student.matricula);
    const attendanceByDate = this.attendanceByDate;
    const percentageAttendance = this.percentageAttendance;

    let headerMonths = [{ text: `Total de asistencias: ${this.totalAttendance}`, colSpan: 3 }, '', ''];
    let headerDetails = ['No.', 'Matricula', 'Nombre'];

    for (let monthObj of groupedDates) {
      headerMonths.push({ text: monthObj.month.charAt(0).toUpperCase() + monthObj.month.slice(1), colSpan: monthObj.days.length });
      for (let day of monthObj.days) {
        headerDetails.push(day);
      }
      for (let i = 1; i < monthObj.days.length; i++) {
        headerMonths.push('');
      }
    }

    headerMonths.push({ text: '', colSpan: 1 });
    headerDetails.push('%Asis.');

    // Crear un array para el informe
    let report = [];

    // Añadir las cabeceras al informe
    report.push(headerMonths);
    report.push(headerDetails);

    // Añadir los datos de cada estudiante al informe
    for (let i = 0; i < students.length; i++) {
      let row = [
        i + 1,
        matriculas[i] || 0,
        students[i] || 0,
        ...attendanceByDate[i],
        percentageAttendance[i] || '0.00',
      ];
      report.push(row);
    }
    // Crear la definición del documento para pdfmake
    let docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: `Reporte de ${namePartial} parcial\n`, style: 'header' },
        { text: `Materia: ${nameSubject} \tGrado: ${grade} \tGrupo: ${group} \tPeriodo: ${period}`, },
        { text: `Fecha del ${namePartial} parcial: ${startDate} - ${finishDate}\n\n`, },
        {
          table: {
            widths: new Array(headerDetails.length).fill('auto'),
            headerRows: 2,
            body: report
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        bigger: {
          fontSize: 15,
          italics: true
        }
      }
    };

    // Crear el PDF
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.download(`Reporte ${namePartial} parcial ${startDate} - ${finishDate}`);
  }

  groupByDate(dates: string[]) {
    let groupedDates = [];
    for (let date of dates) {
      let dateObj = new Date(date);
      let month = dateObj.toLocaleString('es-ES', { month: 'long' });

      let monthObj = groupedDates.find(m => m.month === month);
      if (!monthObj) {
        monthObj = { month: month, days: [] };
        groupedDates.push(monthObj);
      }

      monthObj.days.push(dateObj.getDate() + 1);
    }
    // Ordenar los días de cada mes de menor a mayor
    for (let monthObj of groupedDates) {
      monthObj.days.sort((a, b) => a - b);
    }
    return groupedDates;
  }

  getReportByPeriod() {
    this._reportService.getReportByPeriod(this.id, this.periodId).subscribe((data: any) => {
      if (data == null || data == undefined || data == '' || (data.students && data.students.length === 0)) {
        this._sweetAlertService.showErrorToast('No se encontraron datos');
      } else {
        this.studentsArray = data.students.map(data => data.student);
        this.totalAttendance = data.totalAttendances;
        this.percentageAttendance = data.students.map(data => data.averageAttendance);
        this.generateReportPeriod(this.nameSubject, this.grade, this.group,this.period,this.totalAttendance);
        this._sweetAlertService.showSuccessToast('Reporte generado correctamente');
      }
    }, (error) => {
      this._sweetAlertService.showErrorToast('Error al obtener el reporte');
    });
  }

  generateReportPeriod(nameSubject, grade, group,period,totalAttendance) {
    const students = this.studentsArray.map(student => student.fullName);
    const matriculas = this.studentsArray.map(student => student.matricula);
    const percentageAttendance = this.percentageAttendance;
    const header = ['No.', 'Matricula', 'Nombre', '%Asis.'];

    // Crear un array para el informe
    let report = [];

    // Añadir la cabecera al informe
    report.push(header);

    // Añadir los datos de cada estudiante al informe
    for (let i = 0; i < students.length; i++) {
      let row = [
        i + 1,
        matriculas[i] || 0,
        students[i] || 0,
        percentageAttendance[i] || 0,
      ];

      report.push(row);
    }

    // Crear la definición del documento para pdfmake
    let docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: `Reporte del periodo ${period}`, style: 'header' },
        { text: `Materia: ${nameSubject}\tGrado: ${grade}\tGrupo: ${group}\n`, },
        { text: `Total de asistencias: ${totalAttendance}\n\n`, },
        {
          table: {
            headerRows: 1,
            body: report
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        bigger: {
          fontSize: 15,
          italics: true
        }
      }
    };

    // Crear el PDF
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.download(`Reporte periodo ${period}`);
  }

  back() {
    this.router.navigate(['/management-list', this.id]);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
