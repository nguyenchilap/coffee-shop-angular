import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Employee } from '../employee.component';
import { Store } from '../../store/store.component';
import { StoreService } from '../../store/store.service';
import { EmployeeService } from './../employee.service';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  imageSrc: String;
  selectedFile: any ;
  employee = new Employee();
  storeList: Array<Store> = [];

  constructor(private af: AngularFireStorage, private storeService: StoreService, private employeeService: EmployeeService, private router: Router) { 
    this.employee.employeeImage =  "/assets/image/default-employee.jpg";
    this.imageSrc = this.employee.employeeImage;
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

  onSelectRoleChange(event:any) {
    this.employee.employeeRole = event.target.value;
  }

  onSelectStoreChange(event:any) {
    this.employee.storeId = event.target.value;
  }

  onSelectGenderChange(event:any) {
    this.employee.employeeGender = event.target.value;
  }

  UploadImageAndCreateEmployee(){
    if (this.selectedFile){
      const path = `employees/${this.selectedFile.name}-${Math.round(Math.random()*100000000)}`;
      const ref = this.af.ref(path);
      this.af.upload(path, this.selectedFile).snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe(url => {
            this.employee.employeeImage = url; 
            this.createEmployee();
          })
        })
      ).subscribe();
    }
  }

  createEmployee() {
    this.employeeService.createEmployee(this.employee).subscribe(res => {
      alert("Create employee successfully !!!");
      this.router.navigate(['employee']);
    }, error => {
      alert("Create employee failed !! Error: " + error);
    });
  }

  onSubmitCreateEmployee(event:any) {   
    if (this.selectedFile) {
      this.UploadImageAndCreateEmployee();
    }
    else this.createEmployee();
  }

  getAllStore() {
    return this.storeService.getAllStore().subscribe((res:any) => {
      if (res.resObject) this.storeList = res.resObject;
    }, (error:any) => {
      alert('An error has occurred when getting store list !!!');
    })
  }


}
