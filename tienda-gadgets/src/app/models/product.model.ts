export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number; // Opcional para manejar cantidades en el carrito
}