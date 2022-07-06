import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { Employee } from '../../employee/employee.component';
import { Store } from '../../store/store.component';
import { StoreService } from '../../store/store.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {

  checkBoxAllIsSelected!: Boolean;
  storeList: Array<Store> = [];
  selectedStore: Number = 0;

  //Optional================
  @Input() maxPageDisplayed: number = 0;
  @Input() itemPerPage: number = 0;
  @Input() listenToList!: Observable<any>;

  itemList: Array<any> = [];

  @Input() actionCreateText: String = "Blank";
  @Input() actionCreateLink: String = "/";
  @Input() haveFilterBar: Boolean = false;
  @Input() additionalActions: Array<String> = []; 
  //========================

  currentPage: number = 1;
  currentStartPageDisplayed: number = 0;
  itemListOfCurrentPage: Array<any> = [];
  numberOfPage: number = 0;
  ListNumberOfPageDisplayed: Array<number> = [];
  ListNumberOfPage: Array<number> = [];

  @Output() checkBoxSelectAll = new EventEmitter<Boolean>();
  @Output() handleAction = new EventEmitter<String>();
  @Output() reRenderList = new EventEmitter<Array<any>>();
  @Output() selectStore = new EventEmitter<Number>();

  currentUser: Employee = new Employee();

  constructor(private storeService: StoreService) { 
    this.currentUser = JSON.parse(localStorage.getItem('cafeteria_auth')!);
    this.getAllStore();
  }

  ngOnInit(): void {
    this.listenToList.forEach(next => {

      if (!next.resObject) return;

      this.itemList = next.resObject;
      this.numberOfPage = Math.ceil(this.itemList.length/this.itemPerPage);  
      this.ListNumberOfPage = Array(this.numberOfPage).fill(0).map((item, index) => index + 1);
      this.getItemsInCurrentPage();
      this.displayPageNumber();
      this.reRenderList.emit(this.itemListOfCurrentPage);
    });
    
  }

  //handle checkbox logic
  checkBoxAllClicked(isAllChecked:Boolean) {
    $('.action-select-all').prop('checked', isAllChecked);
  }
  
  onCheckBoxSellectAll(){
    this.checkBoxSelectAll.emit(this.checkBoxAllIsSelected);
  }

  checkBoxChangeCheckBoxAll(event:any) {
    this.checkBoxAllIsSelected = event;
  }
  //=======================================

  //handle calling api
  onActionClicked(event:any){
    this.handleAction.emit(event.target.innerHTML);
  }
  //=======================================

  //handle pagination logic
  initital() {
    this.reRenderList.emit(this.itemListOfCurrentPage);
    this.currentPage = 1;
    this.numberOfPage = Math.ceil(this.itemList.length/this.itemPerPage);  
    this.ListNumberOfPage = Array(this.numberOfPage).fill(0).map((item, index) => index + 1);
    this.getItemsInCurrentPage();
    this.displayPageNumber();
    this.activePageNumber();
  }

  getItemsInCurrentPage() {
    this.itemListOfCurrentPage = this.itemList.slice((this.currentPage - 1) * this.itemPerPage, this.itemPerPage * this.currentPage);
  }

  displayPageNumber() {
    if (this.currentStartPageDisplayed < 0) this.currentStartPageDisplayed = this.ListNumberOfPage.length - this.maxPageDisplayed;
    if (this.currentStartPageDisplayed >= this.ListNumberOfPage.length) this.currentStartPageDisplayed = 0;

    this.ListNumberOfPageDisplayed = this.ListNumberOfPage.slice(this.currentStartPageDisplayed, this.maxPageDisplayed + this.currentStartPageDisplayed);
  }

  onNextPageClick() {
    this.currentStartPageDisplayed += this.maxPageDisplayed;
    this.displayPageNumber();
  }

  onPrevPageClick() {
    this.currentStartPageDisplayed -= this.maxPageDisplayed;
    this.displayPageNumber();
  }

  onGetItemsInCurrentPage(event:any, number:number) {
    this.currentPage = number;
    this.getItemsInCurrentPage();
    this.reRenderList.emit(this.itemListOfCurrentPage);
    this.activePageNumber();
  }

  onSelectNumberOfItemPerPage(event:any) {
    if (event.target.value != 0) {
      this.itemPerPage = event.target.value;
      this.initital();
      this.reRenderList.emit(this.itemListOfCurrentPage);
    }
  }

  activePageNumber() {
    $('.btn-page-number').removeClass('active');
    $(`#page-${this.currentPage}`).addClass('active');
  }
  //=======================================

  //handle filter 
  getAllStore() {
    return this.storeService.getAllStore().subscribe((res:any) => {
      this.storeList = res.resObject;
    }, (error:any) => {
  
    })
  }

  onSelectStoreChange(event:any) {
    this.selectedStore = event.target.value;
    this.selectStore.emit(this.selectedStore);
  }

  onFilterListByStoreId() {
    this.listenToList.forEach(next => {
      
      if (!next.resObject) return;

      this.itemList = next.resObject;
      this.numberOfPage = Math.ceil(this.itemList.length/this.itemPerPage);  
      this.ListNumberOfPage = Array(this.numberOfPage).fill(0).map((item, index) => index + 1);
      this.getItemsInCurrentPage();
      this.displayPageNumber();
      this.reRenderList.emit(this.itemListOfCurrentPage);
      this.currentPage = 1;
      this.activePageNumber();
    })
  }

}
