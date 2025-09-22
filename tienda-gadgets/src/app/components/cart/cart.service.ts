import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product.model'; // Ajuste de ruta

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<Product[]>([]);
  cartItems$ = this.cartItems.asObservable();

  addToCart(product: Product): void {
    const currentItems = this.cartItems.value;
    const existingIndex = currentItems.findIndex(item => item.id === product.id);
    let updatedItems = [...currentItems];
    if (existingIndex > -1) {
      updatedItems[existingIndex] = { 
        ...updatedItems[existingIndex], 
        quantity: (updatedItems[existingIndex].quantity || 1) + 1 
      };
    } else {
      updatedItems.push({ ...product, quantity: 1 });
    }
    this.cartItems.next(updatedItems);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.value;
    this.cartItems.next(currentItems.filter(item => item.id !== productId));
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
}