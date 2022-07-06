import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable,of} from 'rxjs';
import {Employee} from './employee.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';

const apiUrl = 'http://localhost:8080/api/v1/employee';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  constructor(private httpClient:HttpClient, private authGuard: AuthGuard) { }

  getEmployeeById(id: Number):Observable<any> {
    return this.httpClient.get<any>(apiUrl + "/" + id, this.authGuard.setHeader()).pipe();
  }

  getAllEmployee():Observable<any> {
    return this.httpClient.get<any>(apiUrl + "/all", this.authGuard.setHeader()).pipe();
  }

  getAllEmployeeByStoreId(storeId: Number):Observable<Employee[]> {
    if (storeId == 0) return this.getAllEmployee();
    return this.httpClient.get<Employee[]>(apiUrl + "/store/" + storeId, this.authGuard.setHeader()).pipe();
  }

  createEmployee(employee: Employee):Observable<Employee> {
    return this.httpClient.post<Employee>(apiUrl, employee, this.authGuard.setHeader()).pipe();
  }

  deleteOneEmployee(employeeId: Number):Observable<any> {
    return this.httpClient.delete<any>(apiUrl + "/" + employeeId, this.authGuard.setHeader()).pipe();
  }

  deleteEmployeeByIds(employeeIds: Array<Number>):Observable<any> {
    return this.httpClient.delete<any>(apiUrl + "/all?ids=" + employeeIds.toString(), this.authGuard.setHeader()).pipe();
  }

  editEmployee(employee: Employee):Observable<any> {
    return this.httpClient.put<any>(apiUrl, employee, this.authGuard.setHeader()).pipe();
  }
}
