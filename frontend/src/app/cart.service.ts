import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from './producto';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;        // número
  imagen?: string | null;
  qty: number;
  size?: string | null;  // para moda/calzado
  categoria_slug?: string | null;
}

type PersistedCart = { items: CartItem[] };

const LS_KEY = 'marketopos_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  // ===== Estado items (con persistencia) =====
  private items$ = new BehaviorSubject<CartItem[]>(this.load());
  readonly itemsObs$ = this.items$.asObservable();

  private count$ = new BehaviorSubject<number>(this.computeCount(this.items$.value));
  readonly countObs$ = this.count$.asObservable();

  private total$ = new BehaviorSubject<number>(this.computeTotal(this.items$.value));
  readonly totalObs$ = this.total$.asObservable();

  // ===== Estado del modal =====
  private openSubject = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.openSubject.asObservable();
  openCart()  { this.openSubject.next(true); }
  closeCart() { this.openSubject.next(false); }

  /** Añadir al carrito (si existe (id+size), suma qty) */
  add(p: Producto, qty: number = 1, size?: string | null) {
    const precioNum = Number((p as any).precio ?? 0);
    const id = Number((p as any).id);
    const key = (x: CartItem) => `${x.id}-${x.size ?? ''}`;

    const next = [...this.items$.value];
    const found = next.find(x => key(x) === `${id}-${size ?? ''}`);

    if (found) {
      found.qty += qty;
    } else {
      next.push({
        id,
        nombre: p.nombre,
        precio: precioNum,
        imagen: (p as any).imagen ?? null,
        qty,
        size: size ?? null,
        categoria_slug: (p as any).categoria_slug ?? null,
      });
    }

    this.commit(next);
  }

  /** helpers +/- para UI */
  inc(index: number) {
    const current = this.items$.value[index];
    if (!current) return;
    this.setQty(index, current.qty + 1);
  }

  dec(index: number) {
    const current = this.items$.value[index];
    if (!current) return;
    this.setQty(index, current.qty - 1);
  }

  remove(index: number) {
    const next = [...this.items$.value];
    next.splice(index, 1);
    this.commit(next);
  }

  setQty(index: number, qty: number) {
    const next = [...this.items$.value];
    if (qty <= 0) next.splice(index, 1);
    else next[index].qty = qty;
    this.commit(next);
  }

  clear() {
    this.commit([]);
  }

  // ===== Internos =====
  private commit(items: CartItem[]) {
    this.items$.next(items);
    this.count$.next(this.computeCount(items));
    this.total$.next(this.computeTotal(items));
    this.save(items);
  }

  private computeCount(items: CartItem[]) {
    return items.reduce((s, i) => s + i.qty, 0);
  }

  private computeTotal(items: CartItem[]) {
    return items.reduce((s, i) => s + i.qty * i.precio, 0);
  }

  private save(items: CartItem[]) {
    const payload: PersistedCart = { items };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as PersistedCart;
      return parsed.items ?? [];
    } catch {
      return [];
    }
  }
  /** Métodos de acceso directo (para carga inmediata del modal) */
  getItems() {
    // 🔴 Antes: return this.items$.value;
    // ✅ Ahora: devolvemos una copia para forzar detección de cambios
    return [...this.items$.value];
  }

  getCount() {
    return this.count$.value;
  }

  getTotal() {
    return this.total$.value;
  }
}
