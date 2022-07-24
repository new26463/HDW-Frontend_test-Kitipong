import { Component, OnInit } from '@angular/core';
import { product } from 'src/app/core/models/models';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  products: product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProduct().subscribe((res) => {
      this.products = res;
      console.log(this.products);
    });
  }
}
