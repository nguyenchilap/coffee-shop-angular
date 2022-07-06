import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

import { StoreService } from '../../store/store.service';
import { VoucherService } from '../../voucher/voucher.service';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  selectedFile: any;
  imageSrc!: String;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
            @Inject(MAT_DIALOG_DATA) public entity: any, 
            private af: AngularFireStorage, private router: Router,
            private storeService: StoreService, private voucherService: VoucherService, private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    //init current image of entity
    if (this.data.modal.modalInput.find((input: any) => input.inputType == 'image')) {
      this.imageSrc = this.data.modal.modalInput.find((input: any) => input.inputType == 'image')!.inputValue;
    }
    
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e:any) => {
        if (typeof reader.result == 'string') {
          this.imageSrc = reader.result;
        }
      } 
      reader.readAsDataURL(this.selectedFile);
    }
  }

  UploadImageAndEdit(folderName: String, entity: any){
    const path = `${folderName}/${this.selectedFile.name}-${Math.round(Math.random()*1000000)}`;
    const ref = this.af.ref(path);
    this.af.upload(path, this.selectedFile).snapshotChanges().pipe(
      finalize( () => {
        ref.getDownloadURL().subscribe(url => {

          if (folderName == 'stores') {
            entity.storeImage = url;
          } 
          else if (folderName == 'categories') {
            entity.categoryImage = url;
          }

          this.edit(folderName, entity);

        })
      })
    ).subscribe();
  }

  edit(folderName: String, entity: any) {
    if (folderName == 'stores') {
      this.storeService.updateStore(entity).subscribe(res => {
        alert(res.message);
        if (res.resObject) window.location.href = '/store';
      });
    } 
    else if (folderName == 'vouchers') {
      this.voucherService.updateVoucher(entity).subscribe(res => {
        alert(res.message);
        if (res.resObject) window.location.href = '/voucher';
      });
    }
    else if (folderName == 'categories') {
      this.categoryService.updateCategory(entity).subscribe(res => {
        alert(res.message);
        if (res.resObject) window.location.href = '/category';
      });
    }
  }

  onSubmitEdit(form: NgForm) { 
    if (this.data.modal.modalId == 'edit-store') {

      this.data.entity.storeName = form.value.storeName;
      this.data.entity.storeAddress = form.value.storeAddress;

      if (this.selectedFile) {
        this.UploadImageAndEdit('stores', this.data.entity);
      } else {
        this.edit('stores', this.data.entity);
      }
    }
    else if (this.data.modal.modalId == 'edit-category') {

      this.data.entity.beverageList[0].beveragePrice = form.value.beveragePriceS;
      this.data.entity.beverageList[1].beveragePrice = form.value.beveragePriceM;
      this.data.entity.beverageList[2].beveragePrice = form.value.beveragePriceL;
      this.data.entity.categoryName = form.value.categoryName;

      if (this.selectedFile) {
        this.UploadImageAndEdit('categories', this.data.entity);
      } else {
        this.edit('categories', this.data.entity);
      }

    }
    else if (this.data.modal.modalId == 'edit-voucher') {
      this.edit('vouchers', form.value);
    }

  }


}

export class Modal {
  modalId: String;
  modalTitle: String;
  modalInput: Array<InputForm>;

  constructor(modalTitle: String, modalId: String, inputForms: Array<InputForm>) {
    this.modalId = modalId;
    this.modalTitle = modalTitle;
    this.modalInput = inputForms;
  }
}

export class InputForm {
  inputLabel: String;
  inputType: String;
  inputName: String;
  inputId: String;
  inputValue: any;
  inputDisplay: String;
  constructor(inputLabel: String, inputType: String, inputName: String, inputId: String, inputValue: any, inputDisplay: String) {
    this.inputLabel = inputLabel;
    this.inputType = inputType;
    this.inputName = inputName;
    this.inputId = inputId;
    this.inputValue = inputValue;
    this.inputDisplay = inputDisplay;
  }
}