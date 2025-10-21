import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from './cart.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule,],
  template: `
    <div *ngIf="(items$ | async) as items">
      <div *ngFor="let item of items; let i = index">
        <div>
          <strong>{{ $any(item).name }}</strong> — qty: {{ item.qty }}
          <button type="button" (click)="inc(i, item)">+</button>
          <button type="button" (click)="dec(i, item)">-</button>
          <button type="button" (click)="remove(i)">Remove</button>
        </div>
      </div>

      <div class="cart-total">
        Total: {{ total$ | async }}
      </div>

      <div class="cart-actions">
        <button type="button" (click)="goCheckout()">Checkout</button>
        <button type="button" (click)="clear()">Clear cart</button>
      </div>
    </div>
  `,
  styles: []
})
export class CartComponent {
  private cart = inject(CartService);
  private router = inject(Router);

  items$ = this.cart.itemsObs$;
  total$ = this.cart.totalObs$;

  inc(i: number, item: CartItem) { this.cart.setQty(i, item.qty + 1); }
  dec(i: number, item: CartItem) { this.cart.setQty(i, item.qty - 1); }
  remove(i: number)            { this.cart.remove(i); }
  clear()                      { this.cart.clear(); }

  goCheckout() { this.router.navigate(['/checkout']); }
}
