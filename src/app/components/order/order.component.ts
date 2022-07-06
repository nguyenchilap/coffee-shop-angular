import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

import { ActionsComponent } from '../shared/actions/actions.component';
import { Beverage } from './../category/category.component';
import { Voucher } from '../voucher/voucher.component';

import { OrderService } from './order.service';
import { CategoryService } from '../category/category.service';
import { Employee } from '../employee/employee.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  currentUser: Employee = new Employee();

  actionCreateText: String = 'Create new order' ;
  actionCreateLink: String = '/category';

  orderList: Array<Order> = [];

  orderDetails!: Order;

  //0: none
  //1: asc
  //-1: desc
  sort: Number = 0;

  constructor(private actionComponent: ActionsComponent, private orderService: OrderService,
        private router: Router, private categoryService:CategoryService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('cafeteria_auth')!);
    this.getAllOrder();
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
      this.orderList = this.orderList.sort( function(a:any, b:any) {
        if ( a[sortField] < b[sortField] ) return -1;
        if ( a[sortField] > b[sortField] ) return 1;
        return 0;
      })
    } else if (this.sort < 0) {
      this.orderList = this.orderList.sort( function(a:any, b:any) {
        if ( a[sortField] < b[sortField] ) return 1;
        if ( a[sortField] > b[sortField] ) return -1;
        return 0;
      })
    }
  }

  //CheckBox All Handler
  checkBoxAllHandler(checkBoxAllIsSelected:Boolean) {
    this.orderList.forEach(voucher => {
      voucher.isSelected = checkBoxAllIsSelected;
    });
  }

  //CheckBox Handler Change
  onCheckBoxChange() {
    this.actionComponent.checkBoxAllClicked(this.orderList.every(item => {
      return item.isSelected == true;
    }));
  }

  onClickBtnDelete(order: Order) {
    if(confirm('Are you sure to delete this voucher ?!')) {
      this.deleteOneOrder(order);
      this.orderList.splice(this.orderList.indexOf(order), 1);
    }
    else return;
  }

  reRenderOrderList(orderList:Array<Order>) {
    this.orderList = orderList;
  }

  //Order detail
  onClickBtnDetails(order: Order) {
    this.categoryService.getAllCategoryByIds(order.orderBeverages.map((orderBeverage => orderBeverage.beverage.categoryId))).subscribe( res => {

      res.resObject.forEach((category:any, index:number) => {
        order.orderBeverages[index].beverage.category = category;
      });

      this.orderDetails = order;
    })
  }

  //-----------------------------------------------
  //---------------Restful API---------------------
  //-----------------------------------------------
  getOrderListPromise() {
    return this.orderService.getAllOrder();
  }

  getAllOrder() {
    this.orderService.getAllOrder().subscribe(res => {
      if (res.resObject) this.orderList = res.resObject;
      else this.router.navigate(['login']);
    })
  }
  
  deleteOneOrder(order: Order) {
    this.orderService.deleteOneOrder(order.orderId).subscribe(res => {
      alert(res.message);
      if (res.resObject) window.location.href = '/order';
    })
  }

  handleAction(action: String) {
    if (action == 'Delete') {
      if(confirm('Are you sure to delete these orders ?!')) {
        const orderCheckedList = this.orderList.filter(function(order:Order){
          return order.isSelected;
        });
        const listIds = orderCheckedList.map(order => order.orderId).toString()
        this.orderService.deleteMultiOrder(listIds).subscribe(res => {
          alert(res.message);
          if (res.resObject) window.location.href = '/order';
        })
      }
      else return;
    }
  }
}

export class Order {
  orderId: Number;
  orderNote: String;
  orderAddress: String;
  orderDate: Date;
  orderTotal: number;
  orderFinalTotal: Number;
  voucherId: Number;

  isSelected: Boolean;
  orderBeverages: Array<OrderBeverage>;
  voucher!: Voucher;

  constructor() {
    this.orderId = 0;
    this.orderNote = '';
    this.orderAddress = '';
    this.orderDate = new Date(Date.now());
    this.orderTotal = 0;
    this.orderFinalTotal = this.orderTotal;
    this.voucherId = 0;
    this.isSelected = false;
    this.orderBeverages = [];
  }
}

export class OrderBeverage {
  beverage!: Beverage;
  order!: Order;
  quantity: number = 0;

  constructor(beverage: Beverage, quantity: number) {
    this.beverage = beverage;
    this.quantity = quantity;
  }
}