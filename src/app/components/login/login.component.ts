import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee/employee.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  employee: Employee = new Employee();
  notification: String = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    this.authService.login(this.employee).subscribe(res => {
      if (res) {
        window.location.href = "/";
      } else {
        this.notification = "User name or password is incorrect !!!";
      }
    })
  }

}
