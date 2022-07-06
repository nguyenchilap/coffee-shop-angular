import { Injectable } from '@angular/core';
import { Modal } from './modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modals: Array<Modal> = [];

  constructor() { }

  init(modal: Array<Modal>) {
    this.modals = modal;
  }

  remove(id: String) {
    this.modals = this.modals.filter(modal => modal.modalId != id);
  }

  open(id: String) {
    
  }

  
}
