import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { ViewRoutingModule } from '../view-routing.module';

import { ActionsComponent } from './actions/actions.component';
import { ModalComponent } from './modal/modal.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableComponent } from './table/table.component';

@NgModule({
  declarations: [
    ActionsComponent,
    ModalComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    ViewRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCf50GKg4O1Cob01U56mOVTBPCzV-oPR04",
      authDomain: "cafeteria-ef616.firebaseapp.com",
      projectId: "cafeteria-ef616",
      storageBucket: "cafeteria-ef616.appspot.com",
      messagingSenderId: "777787963195",
      appId: "1:777787963195:web:4629c014d1b216f50d691e",
      measurementId: "G-0W4QXEMNYZ"
    }),
    AngularFirestoreModule,
  ],
  exports: [
    ActionsComponent,
    ModalComponent,
  ],
  providers: [
    ActionsComponent, ModalComponent,
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}}
  ],
})
export class SharedComponentModule { }
