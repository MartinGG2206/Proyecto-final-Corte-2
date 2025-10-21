import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service';

@Component({
  standalone: true,
  selector: 'app-cart-modal',
  imports: [CommonModule],
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent {
  cart = inject(CartService);

  close()        { this.cart.closeCart(); }
  inc(i: number) { this.cart.inc(i); }
  dec(i: number) { this.cart.dec(i); }
  remove(i: number) { this.cart.remove(i); }

  checkout() {
    // Aquí conectas pasarela real; de momento mostramos el total.
    // (El total se lee del binding, también puedes suscribirte al observable).
    alert('Redirigir a pasarela de pago...');
  }
}
