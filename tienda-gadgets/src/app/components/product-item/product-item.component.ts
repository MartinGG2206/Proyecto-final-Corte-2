import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-product-item',
  template: `
    <div class="product-card" [style.background-color]="'hsl(' + (product.id * 60) + ', 70%, 80%)'">
      <img [src]="product.image" [alt]="product.name" class="product-image">
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <p class="price">{{ product.price }}</p> <!-- Corrección aquí -->
      <button (click)="addToCart.emit(product)" class="add-btn">Agregar al Carrito</button>
    </div>
  `,
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
}