import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from './producto';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private base = environment.API_BASE;

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/productos/`);
  }

  getProductosByCategoria(slug: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/productos/?categoria=${encodeURIComponent(slug)}`);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/productos/${id}/`);
  }
}
