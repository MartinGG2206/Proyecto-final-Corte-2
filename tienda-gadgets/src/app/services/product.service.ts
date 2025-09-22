import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './product';  // Importa de aquí

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Auriculares RGB',
      description: 'Auriculares inalámbricos con luces LED multicolores para gaming.',
      price: 59.99,
      image: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Auriculares+RGB'
    },
    {
      id: 2,
      name: 'Mouse Gamer Neón',
      description: 'Mouse ergonómico con iluminación neón y 16000 DPI.',
      price: 39.99,
      image: 'https://via.placeholder.com/300x200/00ff00/ffffff?text=Mouse+Neón'
    },
    {
      id: 3,
      name: 'Teclado Mecánico Colorido',
      description: 'Teclado con switches RGB y teclas retroiluminadas en colores vivos.',
      price: 89.99,
      image: 'https://via.placeholder.com/300x200/0000ff/ffffff?text=Teclado+RGB'
    },
    {
      id: 4,
      name: 'Webcam con Luces',
      description: 'Webcam HD con anillo de luces LED para streaming profesional.',
      price: 49.99,
      image: 'https://via.placeholder.com/300x200/ff00ff/ffffff?text=Webcam+Luces'
    },
    {
      id: 5,
      name: 'Soporte Teléfono Giratorio',
      description: 'Soporte magnético con rotación 360° y colores vibrantes.',
      price: 19.99,
      image: 'https://via.placeholder.com/300x200/ffff00/000000?text=Soporte+Teléfono'
    },
    {
      id: 6,
      name: 'Lámpara LED Inteligente',
      description: 'Lámpara de escritorio con control táctil, varios colores suaves y temporizador.',
      price: 29.99,
      image: 'https://via.placeholder.com/300x200/bae1ff/22223b?text=Lámpara+LED'
    }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProduct(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }
}