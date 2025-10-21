import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE, eregisterLocaleData} from '@angular/core';
import esCO from '@angular/common/locales/es-CO';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // <<--- este archivo lo agrego abajo
import { HomePageComponent } from './pages/home-page/home-page.component';

registerLocaleData(esCO);

bootstrapApplication(HomePageComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'COP' },
  ],
}).catch(err => console.error(err));