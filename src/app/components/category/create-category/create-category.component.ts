import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Category, Beverage } from '../category.component';
import { Store } from '../../store/store.component';

import { StoreService } from '../../store/store.service';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  category = new Category();
  sizeList: Array<Beverage> = [new Beverage(1), new Beverage(2), new Beverage(3)];

  imageSrc: String;
  selectedFile: any ;
  storeList: Array<Store> = [];

  constructor(private af: AngularFireStorage, private router: Router , 
              private categoryService: CategoryService, private storeService: StoreService) {
    this.category.categoryImage =  "/assets/image/default-category.jpg";
    this.imageSrc = this.category.categoryImage;
    this.getAllStore();
  }

  ngOnInit(): void {
  }

  onFileSelected(event:any) {
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

  onSelectStoreChange(event:any) {
    this.category.storeId = event.target.value;
  }

  createCategory() {
    this.category.beverageList = this.sizeList;
    this.categoryService.createCategory(this.category).subscribe(res => {
      if (res.status == 'complete') {
        alert(res.message);
        this.router.navigate(['category']);
      }
      else alert(`Create beverage ${this.category.categoryName} failed !!!`)
    })
  }

  UploadImageAndCreateCategory(){
    if (this.selectedFile){
      const path = `categories/${this.selectedFile.name}-${Math.round(Math.random()*100000000)}`;
      const ref = this.af.ref(path);
      this.af.upload(path, this.selectedFile).snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe(url => {
            this.category.categoryImage = url; 
            this.createCategory();
          })
        })
      ).subscribe();
    }
  }

  onSubmitCreateCategory(event:any) {
    if (this.selectedFile) {
      this.UploadImageAndCreateCategory();
    }
    else this.createCategory();
  }

  getAllStore() {
    return this.storeService.getAllStore().subscribe((res:any) => {
      if (res.resObject) this.storeList = res.resObject;
      else alert(res.message);
    })
  }
}
