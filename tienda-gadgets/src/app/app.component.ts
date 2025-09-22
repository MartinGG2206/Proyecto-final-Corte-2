import { Component } from '@angular/core';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';

@Component({
  selector: 'app-root',
  standalone: false, // Si usas módulos, ajusta
  imports: [ProductListComponent, CartComponent],
  template: `
    <header>
      <h1 style="text-align: center; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Tienda de Gadgets Divertidos</h1>
    </header>
    <app-product-list></app-product-list>
    <app-cart></app-cart>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
