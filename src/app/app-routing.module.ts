import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreComponent } from './components/store/store.component';
import { CreateStoreComponent } from './components/store/create-store/create-store.component';

import { EmployeeComponent } from './components/employee/employee.component';
import { CreateEmployeeComponent } from './components/employee/create-employee/create-employee.component';

import { CreateCategoryComponent } from './components/category/create-category/create-category.component';
import { CategoryComponent } from './components/category/category.component';

import { VoucherComponent } from './components/voucher/voucher.component';
import { CreateVoucherComponent } from './components/voucher/create-voucher/create-voucher.component';

import { OrderComponent } from './components/order/order.component';

import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard, AuthorizeGuard } from './helpers/auth.guard';

const routes: Routes = [
  {
    path: 'store', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'store/create', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule),
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'employee', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule),
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'employee/create', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule),
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'category', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'category/create', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule),
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'voucher', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'voucher/create', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule), 
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'order', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'profile', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule), 
    canActivate: [AuthGuard]
  },
  {path: 'login', 
    loadChildren: () => import('./components/view-component.module').then(m => m.ViewComponentModule),  
  },

  {path: '', redirectTo: '/store', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
