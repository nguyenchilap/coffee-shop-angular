import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Modules
import { AppRoutingModule } from '../app-routing.module';
import { SharedComponentModule } from './shared/shared.module';
import { ViewRoutingModule } from './view-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

//Components
import { ActionsComponent } from './shared/actions/actions.component';

import { StoreComponent } from './store/store.component';
import { CreateStoreComponent } from './store/create-store/create-store.component';

import { EmployeeComponent } from './employee/employee.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateEmployeeComponent } from './employee/create-employee/create-employee.component';

import { CategoryComponent } from './category/category.component';
import { OrderComponent } from './order/order.component';
import { CreateCategoryComponent } from './category/create-category/create-category.component';

import { VoucherComponent } from './voucher/voucher.component';
import { CreateVoucherComponent } from './voucher/create-voucher/create-voucher.component';

import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    StoreComponent,
    CreateStoreComponent,
    EmployeeComponent,
    CreateEmployeeComponent,
    CategoryComponent,
    CreateCategoryComponent,
    VoucherComponent,
    CreateVoucherComponent,
    LoginComponent,
    OrderComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    ViewRoutingModule,
    SharedComponentModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
  ],
  exports: [
    StoreComponent,
    CreateStoreComponent,
    EmployeeComponent,
    CreateEmployeeComponent,
    CategoryComponent,
    CreateCategoryComponent,
    VoucherComponent,
    CreateVoucherComponent,
    LoginComponent,
    OrderComponent,
    ProfileComponent,
  ],
  providers: [
    ActionsComponent, StoreComponent, EmployeeComponent, 
  ]
})
export class ViewComponentModule { }
