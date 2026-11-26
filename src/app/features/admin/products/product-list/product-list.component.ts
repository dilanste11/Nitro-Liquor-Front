import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product/product.service';
import { UiService } from '../../../../core/services/ui/ui.service';
import { ProductDTO } from '../../../../models/product/product.dto';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink], // Importamos RouterLink para el botón de "Nuevo Producto"
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private uiService = inject(UiService);

  products: ProductDTO[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los productos', err);
        this.uiService.showToast('Error al cargar los productos', 'error');
        this.isLoading = false;
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.uiService.showToast('Producto eliminado con éxito', 'success');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error al eliminar el producto', err);
          this.uiService.showToast('Error al eliminar el producto', 'error');
        }
      });
    }
  }
}