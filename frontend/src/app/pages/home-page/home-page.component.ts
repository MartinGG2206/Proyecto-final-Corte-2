import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, RouterLink } from '@angular/router';
import { ProductosService } from '../../productos.service';
import { CartService } from '../../cart.service';
import { Producto } from '../../producto';

type Grupo = { nombre: string; items: Producto[] };
type CategoryCard = { name: string; slug: string; icon: string };

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  loading = true;

  productos: Producto[] = [];
  grupos: Grupo[] = [];
  ofertas: Producto[] = [];
  populares: Producto[] = [];

  categories: CategoryCard[] = [];
  selectedCategory: string | null = null;

  // ====== Hero rotativo ======
  heroImages: string[] = [];
  private heroIdx = 0;
  showA = true;   // cuál capa está visible
  bgA = '';       // src capa A
  bgB = '';       // src capa B
  private heroTimer: any;

  private startHeroRotator() {
    if (!this.heroImages.length) return;

    // inicial
    this.heroIdx = 0;
    this.bgA = this.heroImages[0] ?? '';
    this.bgB = this.heroImages[1] ?? this.bgA;

    // cambia cada 5s
    this.heroTimer = setInterval(() => {
      const next = (this.heroIdx + 1) % this.heroImages.length;

      if (this.showA) {
        this.bgB = this.heroImages[next];
        this.showA = false;
      } else {
        this.bgA = this.heroImages[next];
        this.showA = true;
      }

      this.heroIdx = next;
    }, 5000);
  }

  private stopHeroRotator() {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
      this.heroTimer = null;
    }
  }

  // ===== Carrito =====
  cartItems: any[] = [];
  cartCount = 0;
  cartTotal = 0;
  isCartOpen = false;

  @ViewChild('catScroller', { static: false })
  catScroller?: ElementRef<HTMLDivElement>;

  private defaultCategories: CategoryCard[] = [
    { name: 'Electrónica', slug: 'electronica', icon: '📱' },
    { name: 'Computación', slug: 'computacion', icon: '💻' },
    { name: 'Gaming', slug: 'gaming', icon: '🎮' },
    { name: 'Hogar', slug: 'hogar', icon: '🏠' },
    { name: 'Cocina', slug: 'cocina', icon: '🍳' },
    { name: 'Muebles', slug: 'muebles', icon: '🛋️' },
    { name: 'Moda', slug: 'moda', icon: '👗' },
    { name: 'Calzado', slug: 'calzado', icon: '👟' },
    { name: 'Deportes', slug: 'deportes', icon: '🏃‍♂️' },
    { name: 'Salud', slug: 'salud', icon: '🩺' },
    { name: 'Belleza', slug: 'belleza', icon: '💄' },
    { name: 'Niños y Bebés', slug: 'bebes', icon: '🍼' },
    { name: 'Juguetes', slug: 'juguetes', icon: '🧸' },
    { name: 'Mascotas', slug: 'mascotas', icon: '🐾' },
    { name: 'Libros', slug: 'libros', icon: '📚' },
  ];

  constructor(
    private productosService: ProductosService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    // Si el usuario navega (Pagar, Login, etc.), cierra el modal y re-activa el scroll
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        this.isCartOpen = false;
        this.unlockScroll();
      }
    });
  }

  ngOnInit(): void {
    this.cargarTodo();
    this.subscribirCarrito();
  }

  ngOnDestroy(): void {
    this.stopHeroRotator();
    this.unlockScroll();
  }

  // === Suscripción reactiva al carrito ===
  private subscribirCarrito(): void {
    this.cartService.itemsObs$.subscribe(items => {
      this.cartItems = items;
      this.cdr.detectChanges();
    });
    this.cartService.countObs$.subscribe(count => {
      this.cartCount = count;
      this.cdr.detectChanges();
    });
    this.cartService.totalObs$.subscribe(total => {
      this.cartTotal = total;
      this.cdr.detectChanges();
    });
  }

  // Helpers de scroll
  private lockScroll()   { document.body.style.overflow = 'hidden'; }
  private unlockScroll() { document.body.style.overflow = ''; }

  // ===== Modal del carrito =====
  openCart(): void {
    this.isCartOpen = true;
    this.lockScroll();
  }

  closeCart(): void {
    this.isCartOpen = false;
    this.unlockScroll();
  }

  removeItem(index: number): void {
    this.cartService.remove(index);
  }

  // ===== Cargar productos =====
  private cargarTodo(): void {
    this.loading = true;
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = Array.isArray(data) ? data : [];

        // --- Agrupar por categoría usando un nombre robusto ---
        const byCat = new Map<string, Producto[]>();
        for (const p of this.productos) {
          const cat = this.getCategoriaNombre(p);
          if (!byCat.has(cat)) byCat.set(cat, []);
          byCat.get(cat)!.push(p);
        }

        this.grupos = Array.from(byCat.entries()).map(([nombre, items]) => ({
          nombre, items,
        }));

        const backendSlugs = new Set(this.grupos.map((g) => this.slugify(g.nombre)));
        const merged: CategoryCard[] = [];

        for (const g of this.grupos) {
          const slug = this.slugify(g.nombre);
          merged.push({
            name: g.nombre,
            slug,
            icon: this.defaultCategories.find((c) => c.slug === slug)?.icon ?? '📦',
          });
        }

        for (const c of this.defaultCategories) {
          if (!backendSlugs.has(c.slug) && !merged.some((m) => m.slug === c.slug)) {
            merged.push(c);
          }
        }

        this.categories = merged.sort((a, b) => a.name.localeCompare(b.name));
        this.ofertas   = this.pickOfertas(this.productos);
        this.populares = this.pickPopulares(this.productos);
        this.loading = false;

        // ---- Fondo rotativo del hero ----
        const pool = Array.from(
          new Set(
            this.productos
              .map((p: any) => p?.imagen)
              .filter((u: any) => typeof u === 'string' && u.length > 0)
          )
        );

        const fallbacks = [
          'https://images.unsplash.com/photo-1512499617640-c2f999098c67?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=1600&auto=format&fit=crop'
        ];

        this.heroImages = (pool.length ? pool : fallbacks).slice(0, 12);
        this.heroImages.forEach(src => { const i = new Image(); i.src = src; });
        this.stopHeroRotator();
        this.startHeroRotator();
      },
      error: (err) => {
        console.error('❌ Error JSON', err);
        this.loading = false;
      },
    });
  }

  // ===== Helpers =====

  /** Obtiene el NOMBRE de la categoría sin importar cómo venga del backend */
  private getCategoriaNombre(p: any): string {
    return (
      p?.categoria_nombre ||                // serializer la expone como texto
      p?.categoria?.nombre ||               // viene como objeto { nombre }
      (typeof p?.categoria === 'string' ? p.categoria : null) || // ya es texto
      'General'
    );
  }

  /** slugify seguro: solo usa normalize si existe y siempre trabaja con string */
  private slugify(input: any): string {
    let s: any = input ?? 'general';

    if (typeof s !== 'string') {
      s = s?.nombre || s?.name || (typeof s === 'number' ? String(s) : String(s ?? 'general'));
    }

    s = String(s).toLowerCase().trim();

    const hasNormalize = (s as any).normalize && typeof (s as any).normalize === 'function';
    const base = hasNormalize
      ? s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
      : s;

    return base.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'general';
  }

  private pickOfertas(pool: Producto[]): Producto[] {
    const ofertas = pool.filter((p: any) => !!p?.oferta);
    return (ofertas.length ? ofertas : pool).slice(0, 3);
  }

  private pickPopulares(pool: Producto[]): Producto[] {
    const populares = pool.filter((p: any) => !!p?.popular);
    if (populares.length) return populares.slice(0, 4);
    const copy = [...pool];
    return copy.sort(() => 0.5 - Math.random()).slice(0, 4);
  }

  // ===== Categorías =====
  onSelectCategory(cat: CategoryCard) {
    if (this.selectedCategory === cat.slug) {
      this.clearCategory();
      return;
    }
    this.selectedCategory = cat.slug;
    this.cargarPorCategoria(cat.slug);
  }

  clearCategory() {
    this.selectedCategory = null;
    this.cargarTodo();
  }

  private cargarPorCategoria(slug: string) {
    this.loading = true;
    this.productosService.getProductosByCategoria(slug).subscribe({
      next: (data) => {
        const pool = Array.isArray(data) ? data : [];
        this.ofertas = this.pickOfertas(pool);
        this.populares = this.pickPopulares(pool);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error filtrando por categoría', err);
        this.loading = false;
      },
    });
  }

  scrollCategories(dir: 'left' | 'right') {
    const node = this.catScroller?.nativeElement;
    if (!node) return;
    const delta = dir === 'left' ? -400 : 400;
    node.scrollBy({ left: delta, behavior: 'smooth' });
  }

  trackByProducto = (_: number, p: Producto) => (p as any)?.nombre ?? _;
  trackByGrupoCard = (_: number, c: CategoryCard) => c.slug;
}