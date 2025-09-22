import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'; // Solo ProductService
import { Product } from '../../models/product.model'; // Importa Product desde aquí
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="products-grid">
      <app-product-item 
        *ngFor="let product of products" 
        [product]="product" 
        (addToCart)="onAddToCart($event)">
      </app-product-item>
    </div>
  `,
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => this.products = products);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}