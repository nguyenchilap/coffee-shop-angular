import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreComponent } from './store/store.component';
import { CreateStoreComponent } from './store/create-store/create-store.component';

import { EmployeeComponent } from './employee/employee.component';
import { CreateEmployeeComponent } from './employee/create-employee/create-employee.component';

import { CreateCategoryComponent } from './category/create-category/create-category.component';
import { CategoryComponent } from './category/category.component';

import { VoucherComponent } from './voucher/voucher.component';
import { CreateVoucherComponent } from './voucher/create-voucher/create-voucher.component';

import { OrderComponent } from './order/order.component';

import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard, AuthorizeGuard } from '../helpers/auth.guard';


const routes: Routes = [
  {
    path: 'store', 
    component: StoreComponent, 
    canActivate: [AuthGuard]
  },
  {path: 'store/create', component: CreateStoreComponent, canActivate: [AuthorizeGuard]},

  {path: 'employee', component: EmployeeComponent, canActivate: [AuthorizeGuard]},
  {path: 'employee/create', component: CreateEmployeeComponent, canActivate: [AuthorizeGuard]},

  {path: 'category', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'category/create', component: CreateCategoryComponent, canActivate: [AuthorizeGuard]},

  {path: 'voucher', component: VoucherComponent, canActivate: [AuthGuard]},
  {path: 'voucher/create', component: CreateVoucherComponent, canActivate: [AuthorizeGuard]},

  {path: 'order', component: OrderComponent, canActivate: [AuthGuard]},

  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},

  {path: '', redirectTo: '/store', pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewRoutingModule { }
