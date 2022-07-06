import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as $ from 'jquery';

import { ActionsComponent } from '../shared/actions/actions.component';
import { StoreService } from './store.service';
import { Employee } from '../employee/employee.component';
import { Category } from '../category/category.component';
import { Modal, ModalComponent, InputForm } from '../shared/modal/modal.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'] ,
})
export class StoreComponent implements OnInit {

  currentUser: Employee = new Employee();
  actionCreateText = "Create new store";
  actionCreateLink = "/store/create";

  storeList: Array<Store> = [];

  //0: none
  //1: asc
  //-1: desc
  sort: Number = 0;

  constructor(private storeService: StoreService, private actionComponent: ActionsComponent, private dialog: MatDialog) { 
    
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('cafeteria_auth')!);
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
      this.storeList = this.storeList.sort( function(a:any, b:any) {
        if ( a[sortField] < b[sortField] ) return -1;
        if ( a[sortField] > b[sortField] ) return 1;
        return 0;
      })
    } else if (this.sort < 0) {
      this.storeList = this.storeList.sort( function(a:any, b:any) {
        if ( a[sortField] < b[sortField] ) return 1;
        if ( a[sortField] > b[sortField] ) return -1;
        return 0;
      })
    }
  }


  //Modal Handler

  initEditModal(store: Store) {
    const modal = new Modal( 'Edit store', 'edit-store', [
      new InputForm('', 'number', 'storeId', 'storeId', store.storeId, 'none'),
      new InputForm('', 'image', 'storeImage', 'storeImage', store.storeImage, 'block'),
      new InputForm('Name', 'text', 'storeName', 'storeName', store.storeName, 'block'),
      new InputForm('Address', 'text', 'storeAddress', 'storeAddress', store.storeAddress, 'block'),
    ])
    return modal;
  }

  openEditModal(store:Store) {
    const dialogref = this.dialog.open(ModalComponent, {
      data: {
        modal: this.initEditModal(store),
        entity: store
      }
    });
  }

  //CheckBox Handler
  checkBoxAllHandler(checkBoxAllIsSelected:Boolean) {
    this.storeList.forEach(store => {
      store.isSelected = checkBoxAllIsSelected;
    });
  }

  onCheckBoxChange() {
    this.actionComponent.checkBoxAllClicked(this.storeList.every(item => {
      return item.isSelected == true;
    }));
  }
  //===============================

  //Pagination handler
  reRenderStoreList(storeList:Array<Store>) {
    this.storeList = storeList;
  }

  onClickBtnDelete(store:Store) {
    if(confirm('Are you sure to delete this store ?!')) {
      this.deleteOneStore(store);
      this.storeList.splice(this.storeList.indexOf(store), 1);
    }
    else return;
  }

  //-----------------------------------------------
  //---------------Restful API---------------------
  //-----------------------------------------------
  getStoreListPromise() {
    return this.storeService.getAllStore();
  }

  getAll() {
    return this.storeService.getAllStore().subscribe((res:any) => {
      if (res.resObject) this.storeList = res.resObject;
      else alert(res.message);
    });
  }

  deleteOneStore(store: Store) {
    this.storeService.deleteOneStore(store.storeId).subscribe((res:any) => {
      alert(res.message);
      if (res.resObject) window.location.href = '/store';
    })
  }

  deleteMultiStore(storeIds: Array<Number>) {
    this.storeService.deleteMultiStore(storeIds).subscribe(res => {
      alert(res.message);
      if (res.resObject) window.location.href = '/store';
    })
  }

  handleAction(action:String) {
    if (action == 'Delete') {
      if(confirm('Are you sure to delete these stores ?!')) {
        const storeCheckedList = this.storeList.filter(function(store:Store){
          return store.isSelected;
        });
  
        if (storeCheckedList.length <= 0) {
          alert('No store selected !!!');
          return;
        }
        this.deleteMultiStore(storeCheckedList.map(store => store.storeId));
      }
      else return;
    }
  }
  

}

export class Store {
    storeId: number;
    storeName: String;
    storeAddress: String;
    storeImage: String;
    employeeList: Array<Employee>[];
    categoryList: Array<Category>[];
    isSelected: Boolean;
    constructor(){
      this.storeId = 0;
      this.storeName = 'Store';
      this.storeAddress = 'Address';
      this.storeImage = 'Image';
      this.employeeList = [];
      this.categoryList = [];
      this.isSelected = false;
    }
}
