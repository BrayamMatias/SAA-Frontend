import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management-learning-unit',
  templateUrl: './management-learning-unit.component.html',
  styleUrls: ['./management-learning-unit.component.css']
})
export class ManagementLearningUnitComponent implements OnInit{
  
  constructor(private router: Router) { }

  ngOnInit(): void{
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
