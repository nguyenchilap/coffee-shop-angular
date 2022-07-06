import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, BehaviorSubject, map} from 'rxjs';
import { Employee } from '../components/employee/employee.component';

const httpOptions ={
  headers:new HttpHeaders({'Content-Type':'Application/json'})
}
const apiUrl = 'http://localhost:8080/api/v1/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public token!: string;

  constructor(private httpClient:HttpClient) {
    let currentUser = JSON.parse(localStorage.getItem('cafeteria_auth')!);
    this.token = currentUser && currentUser.jwt;
  }

  login(employee: Employee) {
    return this.httpClient.post<Employee>(apiUrl, employee).pipe(map(user => {
      let token = user.jwt;
      if (token) {
        this.token = token;
        localStorage.setItem('cafeteria_auth', JSON.stringify(user));
        return true;
      } else return false;
    }));
  }

  logout() {
    this.token = '';
    localStorage.removeItem('cafeteria_auth');
  }
}
