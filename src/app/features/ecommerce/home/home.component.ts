import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product/product.service';
import { UiService } from '../../../core/services/ui/ui.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private uiService = inject(UiService);
  private cartService = inject(CartService);

  products: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadCatalog();
  }

  loadCatalog() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        // Opcional: Filtrar para que solo se muestren productos con stock > 0
        this.products = data;
        this.isLoading = false;
      },
      error: () => {
        this.uiService.showToast('Error al cargar el catálogo', 'error');
        this.isLoading = false;
      }
    });
  }

  addToCart(product: any) {
  this.cartService.addToCart(product);
  this.uiService.showToast(`${product.name} agregado al carrito`, 'success');
  }
}