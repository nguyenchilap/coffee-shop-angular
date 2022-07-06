import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ActionsComponent } from '../shared/actions/actions.component';
import { VoucherService } from './voucher.service';

import { Modal, ModalComponent, InputForm } from '../shared/modal/modal.component';
import { Employee } from '../employee/employee.component';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {

  currentUser: Employee = new Employee();

  actionCreateText: String = 'Create new voucher' ;
  actionCreateLink: String = '/voucher/create';

  voucherList: Array<Voucher> = [];

  constructor(private actionComponent: ActionsComponent, private voucherService: VoucherService, 
    private router: Router,  private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('cafeteria_auth')!);
    this.getAllVoucher();
  }

  //Modal Handler

  initEditModal(voucher: Voucher) {
    const modal = new Modal( 'Edit voucher', 'edit-voucher', [
        new InputForm('', 'number', 'voucherId', 'voucherId', voucher.voucherId, 'none'),
        new InputForm('Code', 'text', 'voucherCode', 'voucherCode', voucher.voucherCode, 'block'),
        new InputForm('Start date', 'date', 'voucherStartDate', 'voucherStartDate', voucher.voucherStartDate, 'block'),
        new InputForm('End date', 'date', 'voucherEndDate', 'voucherEndDate', voucher.voucherEndDate, 'block'),
        new InputForm('Percentage', 'text', 'voucherPercentage', 'voucherPercentage', voucher.voucherPercentage, 'block'),
        new InputForm('Max sale', 'text', 'voucherMax', 'voucherMax', voucher.voucherMax, 'block'),
        new InputForm('Min order', 'text', 'voucherMinOrder', 'voucherMinOrder', voucher.voucherMinOrder, 'block'),
        new InputForm('Limit', 'text', 'voucherLimit', 'voucherLimit', voucher.voucherLimit, 'block'),
      ])
    return modal;
  }

  openEditModal(voucher:Voucher) {
    const dialogref = this.dialog.open(ModalComponent, {
      data: {
        modal: this.initEditModal(voucher),
        entity: voucher
      }
    });
  }

  //CheckBox  Handler
  checkBoxAllHandler(checkBoxAllIsSelected:Boolean) {
    this.voucherList.forEach(voucher => {
      voucher.isSelected = checkBoxAllIsSelected;
    });
  }

  onCheckBoxChange() {
    this.actionComponent.checkBoxAllClicked(this.voucherList.every(item => {
      return item.isSelected == true;
    }));
  }
  //==========================

  onClickBtnDelete(voucher: Voucher) {
    if(confirm('Are you sure to delete this voucher ?!')) {
      this.deleteOneVoucher(voucher);
      this.voucherList.splice(this.voucherList.indexOf(voucher), 1);
    }
    else return;
  }

  reRenderVoucherList(voucherList:Array<Voucher>) {
    this.voucherList = voucherList;
  }

  //-----------------------------------------------
  //---------------Restful API---------------------
  //-----------------------------------------------
  getVoucherListPromise() {
    return this.voucherService.getAllVoucher();
  }

  getAllVoucher() {
    this.voucherService.getAllVoucher().subscribe(res => {
      if (res.resObject) this.voucherList = res.resObject;
      else this.router.navigate(['login']);
    }) 
  }

  deleteOneVoucher(voucher: Voucher) {
    this.voucherService.deleteOneVoucher(voucher.voucherId).subscribe((res:any) => {
      if (res) alert(`Voucher ${voucher.voucherCode} deleted successfully !!!`);
      else alert(`Could not find voucher ${voucher.voucherCode} !!!`);
    })
  }

  handleAction(action:String) {
    if (action == 'Delete') {
      if(confirm('Are you sure to delete these vouchers ?!')) {
        const voucherCheckedList = this.voucherList.filter(function(voucher:Voucher){
          return voucher.isSelected;
        });
        for(let i = 0; i < voucherCheckedList.length; i++) {
          this.deleteOneVoucher(voucherCheckedList[i]);
          this.voucherList.splice(this.voucherList.indexOf(voucherCheckedList[i]), 1);
        }
        this.router.navigate(['voucher']);
      }
      else return;
    }
  }
}

export class Voucher {
  voucherId: number;
  voucherCode: String;
  voucherStartDate: Date;
  voucherEndDate: Date;
  voucherPercentage: number;
  voucherMax: Number;
  voucherMinOrder: Number;
  voucherLimit: Number;
  constructor() {
    this.voucherId = 0;
    this.voucherCode = '';
    this.voucherStartDate = new Date(Date.now());
    this.voucherEndDate = new Date(Date.now());
    this.voucherPercentage = 0.0;
    this.voucherMax = 10000;
    this.voucherMinOrder = 50000;
    this.voucherLimit = 100;
    this.isSelected = false;
  }

  isSelected: Boolean;
}