import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialService } from 'src/app/services/auth/partial.service';
import { AttendancesService } from 'src/app/services/management/attendances.service';
import { SweetAlertService } from 'src/app/services/sweetAlert/sweet-alert.service';

//Contruir PDF
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { LearningUnitService } from 'src/app/services/management/learning-unit.service';
import { ReportsService } from 'src/app/services/management/reports.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { CookieService } from 'ngx-cookie-service';
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
      this.firstPartial = this.data[0];
      this.secondPartial = this.data[1];
      this.thirdPartial = this.data[2];
    } catch (error) {
      this._sweetAlertService.showErrorToast('Error al obtener los parciales');
    }

  }

  async ngOnInit() {
    await this.getPartials();
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
    let startDate = partial.startDate;
    let finishDate = partial.finishDate;
    this._reportService.getReportByPartial(this.id, startDate, finishDate).subscribe(data => {
      if (data == null || data == undefined || data == '') {
        this._sweetAlertService.showErrorToast('No se encontraron datos');
      } else {
        this.datesArray = (data as any[]).map(data => data.attendances.map(attendances => attendances.createdAt));
        this.studentsArray = (data as any[]).map(data => data.student);
        this.attendanceArray = (data as any[]).map(data => data.attendances);
        this.attendanceByDate = (data as any[]).map(data => data.attendances.map(attendances => attendances.attendance));
        this.totalAttendance = (data as any[]).map(data => data.totalAttendances);
        this.percentageAttendance = (data as any[]).map(data => data.averageAttendance);
        this.generateReportPartial();
        this._sweetAlertService.showSuccessToast('Reporte generado correctamente');
      }
    }, (error) => {
      this._sweetAlertService.showErrorToast('Error al obtener el reporte');
    });
  }

  getReportByPeriod() {
    this._reportService.getReportByPeriod(this.id, this.periodId).subscribe(data => {
      if (data == null || data == undefined || data == '') {
        this._sweetAlertService.showErrorToast('No se encontraron datos');
      } else {
        this.studentsArray = (data as any[]).map(data => data.student);
        this.totalAttendance = (data as any[]).map(data => data.totalAttendances);
        this.percentageAttendance = (data as any[]).map(data => data.averageAttendance);
        this.generateReportPeriod();
        this._sweetAlertService.showSuccessToast('Reporte generado correctamente');
      }

    }, (error) => {
      console.log(error);
      this._sweetAlertService.showErrorToast('Error al obtener el reporte');
    });
  }

  generateReportPartial() {
    const dates = this.datesArray[0];
    const students = this.studentsArray.map(student => student.fullName);
    const matriculas = this.studentsArray.map(student => student.matricula);
    const attendanceByDate = this.attendanceByDate;
    const totalAttendance = this.totalAttendance;
    const percentageAttendance = this.percentageAttendance;
    const header = ['No.', 'Matricula', 'Nombre', ...dates, 'T. Asis.', '%Asis.'];

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
        ...attendanceByDate[i],
        totalAttendance[i] || 0,
        percentageAttendance[i] || 0,
      ];

      // Rellenar con valores vacíos si la fila es más corta que el encabezado
      while (row.length < header.length) {
        row.push('');
      }

      report.push(row);
    }

    // Crear la definición del documento para pdfmake
    let docDefinition = {
      pageOrientation: 'landscape',
      content: [
        {
          table: {
            headerRows: 1,
            body: report
          }
        }
      ]
    };

    // Crear el PDF
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.download();
  }

  generateReportPeriod() {
    const students = this.studentsArray.map(student => student.fullName);
    const matriculas = this.studentsArray.map(student => student.matricula);
    const totalAttendance = this.totalAttendance;
    const percentageAttendance = this.percentageAttendance;
    const header = ['No.', 'Matricula', 'Nombre', 'T. Asis.', '%Asis.'];

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
        totalAttendance[i] || 0,
        percentageAttendance[i] || 0,
      ];

      report.push(row);
    }

    // Crear la definición del documento para pdfmake
    let docDefinition = {
      pageOrientation: 'landscape',
      content: [
        {
          table: {
            headerRows: 1,
            body: report
          }
        }
      ]
    };

    // Crear el PDF
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.download();
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
