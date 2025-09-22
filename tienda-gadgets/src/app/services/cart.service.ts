import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<Product[]>([]); // Inicializado con un array vacío
  cartItems$ = this.cartItems.asObservable();

  addToCart(product: Product): void {
  const currentItems = this.cartItems.value;
  const existingIndex = currentItems.findIndex(item => item.id === product.id);
  if (existingIndex > -1) {
    // Incrementa cantidad (agrega quantity si no lo tienes)
    currentItems[existingIndex] = { ...currentItems[existingIndex], quantity: (currentItems[existingIndex].quantity || 1) + 1 };
  } else {
    this.cartItems.next([...currentItems, { ...product, quantity: 1 }]);
  }
  this.cartItems.next([...currentItems]); // Actualiza el BehaviorSubject
}

  removeFromCart(productId: number): void { // Asegúrate de tipar productId
    const currentItems = this.cartItems.value;
    this.cartItems.next(currentItems.filter(item => item.id !== productId));
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.price, 0);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
}   