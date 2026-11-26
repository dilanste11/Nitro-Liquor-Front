import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Importamos utilidades de rutas
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  currentRole = this.authService.getUserRole();
  currentName = this.authService.getUserName();
  currentEmail = this.authService.getUserEmail();
  currentInitial = this.currentName.charAt(0).toUpperCase();
  // Función para cerrar sesión
  onLogout() {
    this.authService.logout(); // Borra el token
    this.router.navigate(['/login']); // Te patea de vuelta al login
  }
}