import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable,of} from 'rxjs';
import { Voucher } from './voucher.component';
import { AuthGuard } from './../../helpers/auth.guard';
import { Order } from '../order/order.component';

const apiUrl = 'http://localhost:8080/api/v1/voucher';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(private httpClient:HttpClient, private authGuard:AuthGuard) { }

  getVoucherById(voucherId: Number):Observable<any> {
    return this.httpClient.get<any>(apiUrl + "/" + voucherId, this.authGuard.setHeader()).pipe();
  }

  getAllVoucher():Observable<any> {
    return this.httpClient.get<any>(apiUrl + "/all", this.authGuard.setHeader()).pipe();
  }

  getBestVoucherForOrder(order: Order):Observable<any> {
    return this.httpClient.post<any>(apiUrl + "/get-best-voucher", order, this.authGuard.setHeader()).pipe()
  }

  createVoucher(voucher: Voucher):Observable<any> {
    return this.httpClient.post<any>(apiUrl, voucher, this.authGuard.setHeader()).pipe();
  }

  deleteOneVoucher(voucherId: Number):Observable<any> {
    return this.httpClient.delete<any>(apiUrl + "/" + voucherId, this.authGuard.setHeader()).pipe();
  }

  updateVoucher(voucher: Voucher):Observable<any> {
    return this.httpClient.put<any>(apiUrl, voucher, this.authGuard.setHeader()).pipe();
  }

}
