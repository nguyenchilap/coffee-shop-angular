import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import * as $ from 'jquery';

import { Employee } from '../employee/employee.component';

import { EmployeeService } from '../employee/employee.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  employee: Employee = JSON.parse(localStorage.getItem('cafeteria_auth')!); 
  selectedFile: any;
  imageSrc: String = '/assets/image/default-employee.jpg';

  constructor(private af: AngularFireStorage, private router: Router, private employeeService: EmployeeService) {
    this.getEmployeeInfor();
  }

  ngOnInit(): void {
  }

  getEmployeeInfor() {
    this.employeeService.getEmployeeById(this.employee.employeeId).subscribe(res => {
      this.employee = res.resObject;
      this.imageSrc = res.resObject.employeeImage;
    });
  }

  onImageIconBtnClick() {
    $('#btn-choose-image').click();
  }
  
  onSelectGenderChange(event:any) {
    this.employee.employeeGender = event.target.value;
    console.log(this.employee);
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

  UploadImageAndCreateEmployee(){
    if (this.selectedFile){
      const path = `employees/${this.selectedFile.name}-${Math.round(Math.random()*100000000)}`;
      const ref = this.af.ref(path);
      this.af.upload(path, this.selectedFile).snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe(url => {
            this.employee.employeeImage = url; 
            this.editEmployee();
          })
        })
      ).subscribe();
    }
  }

  editEmployee() {
    this.employeeService.editEmployee(this.employee).subscribe(res => {
      alert(res.message);
      if (res.Object) window.location.href = '/profile'
    });
  }

  onSubmitEditEmployee() {
    if (this.selectedFile) {
      this.UploadImageAndCreateEmployee();
    }
    else this.editEmployee();
  }

}
