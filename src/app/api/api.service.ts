import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { product } from '../core/models/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  deleteProduct(data: product) {
    console.log(data);

  }
}
