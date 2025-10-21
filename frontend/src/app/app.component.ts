import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';            // *ngFor, *ngIf
import { HttpClientModule } from '@angular/common/http';   // HttpClient provider (si no usas provideHttpClient en main.ts)
import { RouterOutlet, RouterLink } from '@angular/router'; // <router-outlet> y [routerLink]
import { ProductosService } from './productos.service';
import { Producto } from './producto';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
}
