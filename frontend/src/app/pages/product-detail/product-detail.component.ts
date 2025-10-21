import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductosService } from '../../productos.service';
import { Producto, Review } from '../../producto';
import { Subscription } from 'rxjs';
import { CartService } from '../../cart.service';
import { FormsModule } from '@angular/forms';
import { ReviewsService } from '../../reviews.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  private cart = inject(CartService);
  private router = inject(Router);
  private reviewsService = inject(ReviewsService);

  loading = true;
  error = '';
  producto?: Producto;

  selectedSize: string | null = null;
  quantity = 1;

  // Reseñas
  reviews: Review[] = [];
  newReview: Review = { estrellas: 5, comentario: '' };

  get showSizes() {
    const slug = (this.producto as any)?.categoria_slug || '';
    return slug === 'moda' || slug === 'calzado';
  }

  shoeSizes = ['38', '39', '40', '41', '42', '43', '44'];
  clothingSizes = ['XS', 'S', 'M', 'L', 'XL'];
  get sizes(): string[] {
    const slug = (this.producto as any)?.categoria_slug || '';
    return slug === 'calzado' ? this.shoeSizes : this.clothingSizes;
  }

  /** ID seguro del producto (evita “Property 'id' does not exist…”) */
  get productId(): number | null {
    const anyP = this.producto as any;
    return (anyP?.id ?? anyP?.pk ?? null) as number | null;
  }

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        this.error = 'Producto no válido';
        this.loading = false;
        return;
      }
      this.loading = true;
      this.productosService.getProducto(id).subscribe({
        next: (p) => {
          this.producto = p;
          this.loading = false;
          this.loadReviews();
        },
        error: () => {
          this.error = 'No se pudo cargar el producto.';
          this.loading = false;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ===== Reseñas =====
  loadReviews() {
    const pid = this.productId;
    if (!pid) return;
    this.reviewsService.getReviews(pid).subscribe({
      next: res => (this.reviews = res),
      error: err => console.error('Error cargando reseñas', err)
    });
  }

  submitReview() {
    const pid = this.productId;
    if (!pid) return;
    if (!this.newReview.comentario.trim()) {
      alert('Por favor escribe un comentario.');
      return;
    }
    this.reviewsService.addReview(pid, this.newReview).subscribe({
      next: () => {
        this.newReview = { estrellas: 5, comentario: '' };
        this.loadReviews();
        alert('¡Gracias por tu reseña!');
      },
      error: err => console.error('Error enviando reseña', err)
    });
  }

  // ===== Carrito =====
  selectSize(t: string) { this.selectedSize = t; }

  addToCart() {
    if (this.showSizes && !this.selectedSize) {
      alert('Selecciona una talla antes de continuar.');
      return;
    }
    if (!this.producto) return;
    this.cart.add(this.producto, this.quantity, this.selectedSize ?? null);
    alert('Producto añadido al carrito');
  }
}

