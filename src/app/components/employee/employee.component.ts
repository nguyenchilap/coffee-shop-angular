import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

import { ActionsComponent } from '../shared/actions/actions.component';
import { EmployeeService } from './employee.service';
import { Store } from './../store/store.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  actionCreateText = "Create new employee";
  actionCreateLink = "/employee/create";

  selectedStore: Number = 0;
  storeList: Array<Store> = [];
  employeeList: Array<Employee> = [];

  //0: none
  //1: asc
  //-1: desc
  sort: Number = 0;

  constructor(private employeeService: EmployeeService, private actionComponent: ActionsComponent, private router: Router) {
    
  }

  ngOnInit(): void {
    this.getAll();
  }

  //Sort Handler 
  onSortClicked(event: any) {
    $('.btn-sort-asc').each(function(index) {$(this).removeClass('disabled')} );
    $('.btn-sort-desc').each(function(index) {$(this).removeClass('disabled')} );

    const parentNode = event.target.parentNode.parentNode;
    if (this.sort == 1) {
      this.sort = -1;
      parentNode.querySelector('.btn-sort-asc').classList.add('disabled');
    } else {
      this.sort = 1;
      parentNode.querySelector('.btn-sort-desc').classList.add('disabled');
    }

    this.sortHandler(parentNode.parentNode.getAttribute('sortField'));
  }

  sortHandler(sortField: string) {
    if (this.sort > 0) {
      this.employeeList = this.employeeList.sort( function(a:any, b:any) {
        if ( a[sortField] < b[sortField] ) return -1;
        if ( a[sortField] > b[sortField] ) return 1;
        return 0;
      })
    } else if (this.sort < 0) {
      this.employeeList = this.employeeList.sort( function(a:any, b:any) {
        if ( a[sortField] < b[sortField] ) return 1;
        if ( a[sortField] > b[sortField] ) return -1;
        return 0;
      })
    }
  }

  //CheckBox Handler
  checkBoxAllHandler(checkBoxAllIsSelected:Boolean) {
    this.employeeList.forEach(emlpoyee => {
      emlpoyee.employeeIsSelected = checkBoxAllIsSelected;
    });
  }

  onCheckBoxChange() {
    this.actionComponent.checkBoxAllClicked(this.employeeList.every(item => {
      return item.employeeIsSelected == true;
    }));
  }
  //========================

  storeSelected(storeId: Number) {
    this.selectedStore = storeId;
  }

  reRenderEmployeeList(employeeList: Array<Employee>) {
    this.employeeList = employeeList;
  }

  onClickBtnDelete(employee:Employee) {
    if(confirm('Are you sure to delete this employee ?!')) {
      this.deleteOneEmployee(employee);
      this.employeeList.splice(this.employeeList.indexOf(employee), 1);
    }
    else return;
  }

  //-----------------------------------------------
  //---------------Restful API---------------------
  //-----------------------------------------------

  getEmployeeListPromise() {
    return this.employeeService.getAllEmployeeByStoreId(this.selectedStore);
  }

  getAll() {
    return this.employeeService.getAllEmployeeByStoreId(this.selectedStore).subscribe((res:any) => {
      if (res.resObject) 
        this.employeeList = res.resObject;
      else this.router.navigate(['login']);
    })
  }

  deleteOneEmployee(employee: Employee) {
    this.employeeService.deleteOneEmployee(employee.employeeId).subscribe((res:any) => {
      alert(res.message);
      if (res.resObject) window.location.href = "/employee";
    })
  }

  deleteMultiEmployee(employeeIds: Array<Number>) {
    this.employeeService.deleteEmployeeByIds(employeeIds).subscribe((res:any) => {
      alert(res.message);
      if (res.resObject) window.location.href = "/employee";
    })
  }

  handleAction(action: String) {
    if (action == 'Delete') {
      if(confirm('Are you sure to delete these employees ?!')) {
        const employeeCheckedList = this.employeeList.filter(function(employee:Employee){
          return employee.employeeIsSelected;
        });
  
        if (employeeCheckedList.length <= 0) {
          alert('No employee selected !!!');
          return;
        }
        this.deleteMultiEmployee(employeeCheckedList.map(employee => employee.employeeId));
      }
      else return;
    }
  }

}

export class Employee {
  employeeId: Number;
  employeeName: String;
  employeeEmail: String;
  employeePhone: String;
  employeeGender: Number;
  employeeRole: Number;
  employeeImage: String;
  employeeLoginName: String;
  employeePassword: String;
  employeeIsSelected: Boolean;
  storeId: Number;
  jwt!: string;
  constructor() {
    this.employeeId = 0;
    this.employeeName = "";
    this.employeeEmail = "";
    this.employeePhone = "";
    this.employeeGender = 0;
    this.employeeRole = 1;
    this.employeeImage = "/assets/image/default-employee.jpg";
    this.employeeLoginName = "";
    this.employeePassword = "";
    this.employeeIsSelected = false;
    this.storeId = 1;
  }
}
