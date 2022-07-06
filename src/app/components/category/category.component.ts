import { Component, OnInit } from '@angular/core';
import { ActionsComponent } from '../shared/actions/actions.component';
import { MatDialog } from '@angular/material/dialog';
import * as $ from 'jquery';

import { CategoryService } from './category.service';
import { VoucherService } from '../voucher/voucher.service';
import { OrderService } from '../order/order.service';

import { Store } from './../store/store.component';
import { Router } from '@angular/router';
import { Order, OrderBeverage } from '../order/order.component';
import { Voucher } from '../voucher/voucher.component';
import { Modal, ModalComponent, InputForm } from '../shared/modal/modal.component';
import { Employee } from '../employee/employee.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  currentUser: Employee = new Employee();

  actionCreateText = "Create new beverage";
  actionCreateLink = "/category/create";
  additionalActions = ['Add to order'];

  selectedStore: Number = 0;

  order: Order = new Order();
  voucher!: Voucher;
  storeList: Array<Store> = [];
  categoryList: Array<Category> = [];
  beverageList: Array<Beverage> = [];
  orderBeverageList: Array<OrderBeverage> = [];

  //0: none
  //1: asc
  //-1: desc
  sort: Number = 0;

  constructor(private actionComponent: ActionsComponent, private categoryService: CategoryService, 
            private router:Router , private voucherService: VoucherService,
            private orderService: OrderService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('cafeteria_auth')!);
    this.getAllCategory();
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
      this.categoryList = this.categoryList.sort( function(a:any, b:any) {
        if ( a[sortField] < b[sortField] ) return -1;
        if ( a[sortField] > b[sortField] ) return 1;
        return 0;
      })
    } else if (this.sort < 0) {
      this.categoryList = this.categoryList.sort( function(a:any, b:any) {
        if ( a[sortField] < b[sortField] ) return 1;
        if ( a[sortField] > b[sortField] ) return -1;
        return 0;
      })
    }
  }


  //Modal Handler

  initEditModal(category: Category) {
    const modal = new Modal( 'Edit category', 'edit-category', [
        new InputForm('', 'number', 'categoryId', 'categoryId', category.categoryId, 'none'),
        new InputForm('', 'image', 'categoryImage', 'categoryImage', category.categoryImage, 'block'),
        new InputForm('', 'text', 'categoryName', 'categoryName', category.categoryName, 'block'),
        new InputForm('Size S - Price', 'number', 'beveragePriceS', 'beveragePriceS', category.beverageList[0].beveragePrice, 'block'),
        new InputForm('Size M - Price', 'number', 'beveragePriceM', 'beveragePriceM', category.beverageList[1].beveragePrice, 'block'),
        new InputForm('Size L - Price', 'number', 'beveragePriceL', 'beveragePriceL', category.beverageList[2].beveragePrice, 'block'),
      ])
    return modal;
  }

  openEditModal(category: Category) {
    const dialogref = this.dialog.open(ModalComponent, {
      data: {
        modal: this.initEditModal(category),
        entity: category
      }
    });
  }

  //CheckBox Handler
  checkBoxAllHandler(checkBoxAllIsSelected:Boolean) {
    this.categoryList.forEach(category => {
      category.isSelected = checkBoxAllIsSelected;
    });
  }

  onCheckBoxChange() {
    this.actionComponent.checkBoxAllClicked(this.categoryList.every(item => {
      return item.isSelected == true;
    }));
  }

  onBeverageChecBoxChange(beverage: Beverage) {
    const index = this.beverageList.find(_beverage => _beverage.beverageId == beverage.beverageId);
    this.beverageList[this.beverageList.indexOf(index!)].isSelected = beverage.isSelected;
  }

  //==============================================

  storeSelected(storeId: Number) {
    this.selectedStore = storeId;
  }

  reRenderCategoryList(categoryList: Array<Category>) {
    this.categoryList = categoryList;
  }

  onClickBtnDelete(category:Category){
    if(confirm('Are you sure to delete this category ?!')) {
      this.deleteOneCategory(category);
    }
    else return;
  }  

  //----------------------------
  //---- Order-handle-----------
  //----------------------------

  onQuantityChange(orderBeverage: OrderBeverage) {
    //re-calc order total
    this.reCalculateTotal();
  }

  onRemoveBeverageFromOrder(orderBeverage: OrderBeverage) {
    this.orderBeverageList.splice(this.orderBeverageList.indexOf(orderBeverage), 1);
    this.reCalculateTotal();
  }

  onGetVoucherClick(order: Order) {
    if (this.order.orderTotal) {
      this.voucherService.getBestVoucherForOrder(order).subscribe(res => {
        this.voucher = res.resObject;
        this.order.voucherId = res.resObject.voucherId;
        this.order.orderFinalTotal = this.order.orderTotal -  this.order.orderTotal * this.voucher.voucherPercentage;
      });
    }
  }

  reCalculateTotal() {
    this.order.orderTotal = this.orderBeverageList.reduce( (accumulator, orderBeverage) => {
      return accumulator + orderBeverage.beverage.beveragePrice * orderBeverage.quantity;
    }, 0);

    if (this.voucher) {
      this.order.orderFinalTotal = this.order.orderTotal - this.order.orderTotal * this.voucher.voucherPercentage;
    }
    else this.order.orderFinalTotal = this.order.orderTotal
  }

  onResetOrder() {
    if (confirm('Are you sure to reset this order ??')) {
      this.order = new Order();
      this.orderBeverageList = [];
    } else return ;
  }

  onCreateOrder() {
    if (confirm('Are you sure to create order with these beverages ??')) {
      this.orderService.createOrder(this.order).subscribe( res => {
        this.orderBeverageList = this.orderBeverageList.map(orderBeverage => {
          orderBeverage.beverage.category = new Category();
          orderBeverage.order = res.resObject;
          return orderBeverage;
        });
        this.orderService.addBeverageToOrder(this.orderBeverageList).subscribe(res => {
          alert(res.message);
          if (res.resObject) this.router.navigate(['order']);
        })
      })
    } else return ;
  }

  //-----------------------------------------------
  //---------------Restful API---------------------
  //-----------------------------------------------
  getCategoryListPromise() {
    return this.categoryService.getAllCategoryByStoreId(this.selectedStore);
  } 

  getAllCategory() {
    return this.categoryService.getAllCategoryByStoreId(this.selectedStore).subscribe((res:any) => {
      this.categoryList = res.resObject;
      this.categoryList.forEach(category => {
        for (let i = 0; i < category.beverageList.length; i++) {
          category.beverageList[i].category = category;
        }
        this.beverageList.push(...category.beverageList);
      })
    }, (error:any) => {
      this.router.navigate(['login']);
    })
  }

  deleteOneCategory(category: Category) {
    this.categoryService.deleteOneCategory(category.categoryId).subscribe((res:any) => {
      alert(res.message);
      if (res.resObject) window.location.href = "/category";
    })
  }

  //handle actions
  handleActionDelete() {
    if(confirm('Are you sure to delete these categories ?!')) {
      const categoryCheckedList = this.categoryList.filter(category => category.isSelected);

      if (categoryCheckedList.length <= 0) {
        alert('No beverage selected !!!');
        return;
      }

      for(let i = 0; i < categoryCheckedList.length; i++) {
        this.deleteOneCategory(categoryCheckedList[i]);
        this.categoryList.splice(this.categoryList.indexOf(categoryCheckedList[i]), 1);
      }
      this.router.navigate(['category']);
    }
    else return;
  }

  handleActionCreateOrder() {
    if(confirm('Do you want to create order with theses beverages ?!')) {
      const beverageCheckedList = this.beverageList.filter(beverage => beverage.isSelected);

      if (!beverageCheckedList.length) {
        alert('No beverage have been selected !!');
        return;
      }
      else {
        beverageCheckedList.forEach(beverage => {
          //check if exist -> increase quantity
          let indexExisted = this.orderBeverageList.findIndex(orderBeverage => orderBeverage.beverage == beverage);
          if (indexExisted > -1) {
            this.orderBeverageList[indexExisted].quantity +=1
          }
          //if not exist yet -> push 
          else this.orderBeverageList.push(new OrderBeverage(beverage, 1));
        })
      }

      //re-calc order total
      this.reCalculateTotal();

      //reset checkbox
      for (let i = 0; i < this.categoryList.length; i++) {
        for (let j = 0; j < this.categoryList[i].beverageList.length; j++) {
          this.categoryList[i].beverageList[j].isSelected = false;
          this.beverageList[i*j].isSelected = false;
        }
      }

      document.getElementById('order-creator')?.scrollIntoView();
    }
    else return;
  }

  handleAction(action:String) {
    if (action == 'Delete') {
      this.handleActionDelete();
    }
    else if (action == 'Add to order') {
      this.handleActionCreateOrder();
    }
  }
}

export class Category {
  categoryId: number;
  categoryName: String;
  categoryImage: String;
  storeId: number;
  beverageList: Array<Beverage>;
  isSelected: Boolean;
  constructor(){
    this.storeId = 1;
    this.categoryId = 0;
    this.categoryName = '';
    this.categoryImage = '/assets/image/default-category.jpg';
    this.isSelected = false;
    this.beverageList = [];
  }
}

export class Beverage {
  beverageId: number;
  beverageSize: Number;
  beveragePrice: number;
  categoryId!: number;
  isSelected: Boolean;
  constructor(size: number) {
    this.beverageId = 0;
    this.beveragePrice = 0;
    this.beverageSize = size;
    this.isSelected = false;
  } 

  category!: Category;
}
