import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from './producto';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private base = 'http://localhost:8000/api'; // ajusta si usas otro prefijo

  constructor(private http: HttpClient) {}

  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.base}/productos/${productId}/reviews/`);
  }

  addReview(productId: number, body: Review): Observable<any> {
    return this.http.post(`${this.base}/productos/${productId}/reviews/`, body);
  }
}
