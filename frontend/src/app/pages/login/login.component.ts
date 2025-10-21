import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  /** Cerrar modal: botón, clic fuera o ESC */
  close() {
    // vuelve al home y cierra el modal
    this.router.navigateByUrl('/home');
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.close();
  }

  doLogin() {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.close(); // cerrar modal tras login correcto
      },
      error: (e: any) => {
        this.loading = false;
        this.error = e?.error?.detail || 'Credenciales inválidas';
      }
    });
  }

  doRegister() {
    this.loading = true;
    this.error = '';
    this.success = '';

    // 1) Crear cuenta
    this.auth.register(this.username, this.password).subscribe({
      next: () => {
        // 2) Autologin con las mismas credenciales
        this.auth.login(this.username, this.password).subscribe({
          next: () => {
            this.loading = false;
            this.close(); // 3) cerrar modal tras registrar + loguear
          },
          error: (e: any) => {
            this.loading = false;
            this.error = e?.error?.detail || 'No se pudo iniciar sesión automáticamente.';
          }
        });
      },
      error: (e: any) => {
        this.loading = false;
        this.error = e?.error?.detail || 'No se pudo crear la cuenta';
      }
    });
  }
}
