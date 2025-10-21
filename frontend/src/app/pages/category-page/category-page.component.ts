import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductosService } from '../../productos.service';
import { Producto } from '../../producto';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-category-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  slug = '';
  nombreCategoria = '';
  productos: Producto[] = [];
  loading = true;

  private sub?: Subscription;

  constructor(private route: ActivatedRoute, private productosService: ProductosService) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      // Para título bonito a partir del slug
      this.nombreCategoria = this.slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      this.loading = true;
      this.productosService.getProductosByCategoria(this.slug).subscribe({
        next: data => { this.productos = Array.isArray(data) ? data : []; this.loading = false; },
        error: err => { console.error(err); this.loading = false; }
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  trackByProd = (_: number, p: Producto) => (p as any)?.nombre ?? _;
}
