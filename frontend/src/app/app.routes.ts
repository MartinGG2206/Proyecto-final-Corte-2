import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },

  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component')
        .then(m => m.LoginComponent),
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component')
        .then(m => m.CheckoutComponent),
  },

  { path: '**', redirectTo: '' },
];
