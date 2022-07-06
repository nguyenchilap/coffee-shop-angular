import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Store } from '../store.component';
import { StoreService } from '../store.service';
import { Router } from '@angular/router';

import * as $ from 'jquery';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.css']
})
export class CreateStoreComponent implements OnInit {

  imageSrc: String;
  selectedFile: any ;
  store = new Store();

  constructor(private af: AngularFireStorage, private storeService: StoreService, private router: Router) { 
    this.store.storeImage = "/assets/image/default-store.jpg";
    this.imageSrc = '/assets/image/default-store.jpg';
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

  UploadImageAndCreateStore(){
    if (this.selectedFile){
      const path = `stores/${this.selectedFile.name}-${Math.round(Math.random()*1000000)}`;
      const ref = this.af.ref(path);
      this.af.upload(path, this.selectedFile).snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe(url => {
            this.store.storeImage = url; 
            this.createStore();
          })
        })
      ).subscribe();
    }
  }

  createStore() {
    this.storeService.createStore(this.store).subscribe(res => {
      alert(res.message);
      if (res.resObject) this.router.navigate(['store']);
    });
  }

  onSubmitCreateStore(event:any) {
    if (this.selectedFile) {
      this.UploadImageAndCreateStore();
    }
    else this.createStore();
  }


}
