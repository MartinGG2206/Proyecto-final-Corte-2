import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule,],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private cart = inject(CartService);
  private router = inject(Router);

  items$ = this.cart.itemsObs$;
  total$ = this.cart.totalObs$;

  // formulario (simulado)
  name = '';
  email = '';
  address = '';
  card = '';

  paying = false;
  done = false;
  orderId = '';

  pay() {
    if (!this.name || !this.email || !this.address || !this.card) {
      alert('Completa todos los datos.');
      return;
    }
    this.paying = true;

    // simulamos procesamiento
    setTimeout(() => {
      this.orderId = 'ORD-' + Math.floor(Math.random() * 1e8).toString();
      this.paying = false;
      this.done = true;
      this.cart.clear();
    }, 1200);
  }

  goHome() { this.router.navigate(['/']); }
}
