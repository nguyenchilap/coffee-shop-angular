import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Store} from './store.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';

const apiUrl = 'http://localhost:8080/api/v1/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private httpClient:HttpClient, private authGuard:AuthGuard) { }

  getAllStore():Observable<any>{
    return this.httpClient.get<any>(apiUrl + '/all', this.authGuard.setHeader()).pipe();
  }

  getStoreById(storeId: Number):Observable<any>{
    return this.httpClient.get<any>(apiUrl + "/" + storeId, this.authGuard.setHeader()).pipe();
  }

  createStore(store: Store):Observable<any>{
    return this.httpClient.post<any>(apiUrl, store, this.authGuard.setHeader()).pipe();
  }

  deleteOneStore(storeId: Number):Observable<any>{
    return this.httpClient.delete<any>(apiUrl + "/" + storeId, this.authGuard.setHeader()).pipe();
  }

  deleteMultiStore(storeIds: Array<Number>):Observable<any>{
    return this.httpClient.delete<any>(apiUrl + "/all?ids=" + storeIds.toString(), this.authGuard.setHeader()).pipe();
  }

  updateStore(store: any):Observable<any>{
    return this.httpClient.put<any>(apiUrl, store, this.authGuard.setHeader()).pipe();
  }
}
