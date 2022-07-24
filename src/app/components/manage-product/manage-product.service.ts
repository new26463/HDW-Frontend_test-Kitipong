import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { product } from 'src/app/core/models/models';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManageProductService {
  constructor(private http: HttpClient) {}

  getProduct() {
    return this.http.get<product[]>(`${url}/products`);
  }

  getProductById(id: number) {
    return this.http.get<product>(`${url}/products/${id}`);
  }

  deleteProduct(id: number) {
    return this.http.delete<any>(`${url}/products/${id}`);
  }

  createProduct(product: any) {
    return this.http.post<any>(url + '/products', product);
  }

  editProduct(product: any, id: number) {
    return this.http.patch(`${url}/products/${id}`, product);
  }
}
