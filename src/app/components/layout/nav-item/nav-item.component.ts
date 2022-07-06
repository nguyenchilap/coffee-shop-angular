import { Component, OnInit } from '@angular/core';

import { Employee } from '../../employee/employee.component';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {

  navConcept =  window.location.href.split('/')[3];
  navList: Array<navItem> = [];
  currentUser: Employee = JSON.parse(localStorage.getItem('cafeteria_auth')!);

  constructor() {
    if (this.currentUser.employeeRole == 1) {
      this.navList.push(
        {navIcon: 'store', navTitle: 'Stores', navRouterLink: 'store'},
        {navIcon: 'supervisor_account', navTitle: 'Employees', navRouterLink: 'employee'},
        {navIcon: 'local_cafe', navTitle: 'Beverages', navRouterLink: 'category'},
        {navIcon: 'card_giftcard', navTitle: 'Vouchers', navRouterLink: 'voucher'},
        {navIcon: 'receipt', navTitle: 'Orders', navRouterLink: 'order'},
        {navIcon: 'settings', navTitle: 'Profile', navRouterLink: 'profile'},
      )
    }
    else if (this.currentUser.employeeRole == 2) {
      this.navList.push(
        {navIcon: 'store', navTitle: 'Stores', navRouterLink: 'store'},
        {navIcon: 'local_cafe', navTitle: 'Beverages', navRouterLink: 'category'},
        {navIcon: 'card_giftcard', navTitle: 'Vouchers', navRouterLink: 'voucher'},
        {navIcon: 'receipt', navTitle: 'Orders', navRouterLink: 'order'},
        {navIcon: 'settings', navTitle: 'Profile', navRouterLink: 'profile'},
      )
    }
  }

  ngOnInit(): void {
  }

}

class navItem {
    navIcon: String;
    navTitle: String;
    navRouterLink: String;
    constructor () {
        this.navIcon = "home";
        this.navTitle = "Home";
        this.navRouterLink = "id";
    }
}