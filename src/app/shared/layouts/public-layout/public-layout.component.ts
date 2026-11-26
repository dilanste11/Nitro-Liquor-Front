import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink], //
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})

export class PublicLayoutComponent implements OnInit {
  private cartService = inject(CartService);
  public authService = inject(AuthService);
  private router = inject(Router);
  cartItemCount = 0; 
  isUserMenuOpen = false;

ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeUserMenu();
    this.router.navigate(['/login']);
  }
}