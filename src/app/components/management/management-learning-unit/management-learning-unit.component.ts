import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearningUnitService } from 'src/app/services/learning-unit.service';

@Component({
  selector: 'app-management-learning-unit',
  templateUrl: './management-learning-unit.component.html',
  styleUrls: ['./management-learning-unit.component.css']
})
export class ManagementLearningUnitComponent implements OnInit{

  learningUnits: any[] = [];
  
  constructor(
    private router: Router,
    private __learnUnitService: LearningUnitService

  ) { }

  ngOnInit(): void{
    this.getLearningUnits();
  }

  getLearningUnits(){
    this.__learnUnitService.getLearningUnits().subscribe((data) => {
      this.learningUnits = data.map((unit: any) => {
        if (unit.name) {
          unit.name = unit.name.replace(/-/g, ' ')
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
        return unit;
      });
      console.log(this.learningUnits);
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
