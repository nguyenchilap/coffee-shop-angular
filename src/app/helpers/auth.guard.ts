import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpHeaders } from "@angular/common/http";
import { Location } from '@angular/common';

import { Employee } from '../components/employee/employee.component';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {
        if (localStorage.getItem('cafeteria_auth')) {
            // logged in so return true
            return true;
        }
 
        // not logged in so redirect to login page
        this.router.navigate(['login']);
        return false;
    }

    setHeader(): Object {
        if (localStorage.getItem('cafeteria_auth')) 
            return {
                headers:new HttpHeaders({
                  'Content-Type':'Application/json',
                  'Authorization': 'Bearer ' +  JSON.parse(localStorage.getItem('cafeteria_auth')!).jwt 
                })
            }
        else return {
            headers:new HttpHeaders({
              'Content-Type':'Application/json',
              'Authorization': 'Bearer ' +  ''
            })
        }
    }
}


@Injectable()
export class AuthorizeGuard implements CanActivate {
    
    currentUser!: Employee;

    constructor(private location: Location) { }
 
    canActivate() {
        if (localStorage.getItem('cafeteria_auth')) {
            this.currentUser = JSON.parse(localStorage.getItem('cafeteria_auth')!);
            if (this.currentUser.employeeRole == 1) return true;
        }
        this.location.back();
        return false;
    }
}