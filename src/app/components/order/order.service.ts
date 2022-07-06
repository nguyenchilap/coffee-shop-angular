import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable,of} from 'rxjs';
import { Order, OrderBeverage } from './order.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';

const apiUrl = 'http://localhost:8080/api/v1/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient:HttpClient, private authGuard: AuthGuard) { }

  getOrderById(orderId: Number):Observable<any> {
    return this.httpClient.get<any>(apiUrl + "/" + orderId, this.authGuard.setHeader()).pipe();
  }

  getAllOrder():Observable<any> {
    return this.httpClient.get<any>(apiUrl + "/all", this.authGuard.setHeader()).pipe();
  }

  createOrder(order: Order):Observable<any> {
    return this.httpClient.post<any>(apiUrl, order, this.authGuard.setHeader()).pipe();
  }

  deleteOneOrder(orderId: Number):Observable<any> {
    return this.httpClient.delete<any>(apiUrl + "/" + orderId, this.authGuard.setHeader()).pipe();
  }

  deleteMultiOrder(orderIds: String):Observable<any> {
    return this.httpClient.delete<any>(apiUrl + "/all?ids=" + orderIds, this.authGuard.setHeader()).pipe();
  }

  addBeverageToOrder(orderBeverages: Array<OrderBeverage>):Observable<any> {
    return this.httpClient.post<any>(apiUrl + "/add-beverage-to-order", orderBeverages, this.authGuard.setHeader()).pipe()
  }
}
