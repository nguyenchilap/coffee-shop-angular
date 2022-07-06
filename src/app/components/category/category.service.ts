import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable,of} from 'rxjs';
import { Category } from './category.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';

const apiUrl = 'http://localhost:8080/api/v1/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient:HttpClient, private authGuard: AuthGuard) {
    
  }

  getCategoryById(categoryId: Number):Observable<any> {
    return this.httpClient.get<any>(apiUrl + "/" + categoryId, this.authGuard.setHeader()).pipe();
  }

  getAllCategory():Observable<any> {
    return this.httpClient.get<any>(apiUrl + "/all", this.authGuard.setHeader()).pipe();
  }
  
  getAllCategoryByIds(ids: Array<number>):Observable<any> {
    return this.httpClient.get<any>(apiUrl + "/all-by-id?ids=" + ids.toString(), this.authGuard.setHeader()).pipe();
  }

  getAllCategoryByStoreId(storeId: Number):Observable<any> {
    if (storeId == 0) return this.getAllCategory();
    return this.httpClient.get<any>(apiUrl + "/store/" + storeId, this.authGuard.setHeader()).pipe();
  }

  createCategory(category: Category):Observable<any> {
    return this.httpClient.post<any>(apiUrl, category, this.authGuard.setHeader()).pipe();
  }

  deleteOneCategory(categoryId: Number):Observable<any> {
    return this.httpClient.delete<any>(apiUrl + "/" + categoryId, this.authGuard.setHeader()).pipe();
  }

  updateCategory(category: Category):Observable<any> {
    return this.httpClient.put<any>(apiUrl, category, this.authGuard.setHeader()).pipe();
  }
  
}
