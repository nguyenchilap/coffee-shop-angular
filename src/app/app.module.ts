import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedComponentModule } from './components/shared/shared.module';
import { ViewComponentModule } from './components/view-component.module';

import { AppComponent } from './app.component';
import { NavItemComponent } from './components/layout/nav-item/nav-item.component';

import { AuthGuard, AuthorizeGuard } from './helpers/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavItemComponent,
  ],
  imports: [
  BrowserModule,
    SharedComponentModule,
    ViewComponentModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  providers: [
    AuthGuard, AuthorizeGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
