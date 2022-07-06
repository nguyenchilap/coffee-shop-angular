import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Beverage } from './category.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';

const apiUrl = 'http://localhost:8080/api/v1/beverage';

@Injectable({
  providedIn: 'root'
})
export class BeverageService {

  constructor(private httpClient:HttpClient, private authGuard: AuthGuard) { }

  getAllBeverage():Observable<Beverage[]> {
    return this.httpClient.get<Beverage[]>(apiUrl + "/all", this.authGuard.setHeader()).pipe();
  }

  getAllBeverageByCategoryId(categoryId: Number):Observable<Beverage[]> {
    if (categoryId == 0) return this.getAllBeverage();
    return this.httpClient.get<Beverage[]>(apiUrl + "/category/" + categoryId, this.authGuard.setHeader()).pipe();
  }

  createBeverage(beverage: Beverage):Observable<any> {
    return this.httpClient.post<any>(apiUrl, beverage, this.authGuard.setHeader()).pipe();
  }

  createBeverages(beverages: Array<Beverage>):Observable<any> {
    return this.httpClient.post<any>(apiUrl + "/all", beverages, this.authGuard.setHeader()).pipe();
  }

  deleteOneBeverage(beverageId: Number):Observable<any> {
    return this.httpClient.delete<any>(apiUrl + "/" + beverageId, this.authGuard.setHeader()).pipe();
  }
}
