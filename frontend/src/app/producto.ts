// Tipos de dominio

export interface Producto {
  id: number;                // <- IMPORTANTE para que no marque error
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen?: string | null;
  categoria?: string | null;
  categoria_slug?: string | null;
  popular?: boolean;
  oferta?: boolean;
}

// Reseñas
export interface Review {
  id?: number;
  usuario?: string | null;
  estrellas: number;         // 1..5
  comentario: string;
  fecha?: string | Date;
}
