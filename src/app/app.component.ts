import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from './components/employee/employee.service';

import { Employee } from './components/employee/employee.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cafeteria';
  currentUser!: Employee;

  constructor(private router: Router, public authService: AuthService, 
    private employeeService: EmployeeService) {

  }
  
  ngOnInit() {
    if (localStorage.getItem('cafeteria_auth')) {
      this.currentUser = JSON.parse(localStorage.getItem('cafeteria_auth')!);
      this.employeeService.getEmployeeById(this.currentUser.employeeId).subscribe(res => {
        this.currentUser = res.resObject;
      });
    }
    setTimeout(() => {
      localStorage.removeItem('cafeteria_auth');
    }, 1000 * 60 * 60);

    document.body.onclick = function(e) {
      $('.user-navigation').removeClass('active');
    }

  }

  onUserButtonClick(event:any) {
    $('.user-navigation').toggleClass('active'); 
    event.stopPropagation();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}

