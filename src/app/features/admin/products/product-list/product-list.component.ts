import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product/product.service';
import { ProductDTO } from '../../../../models/product/product.dto';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink], // Importamos RouterLink para el botón de "Nuevo Producto"
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  
  products: ProductDTO[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        // Asumiendo que tu API devuelve directamente el array. 
        // Si devuelve { data: [...] }, ajusta esto a data.data
        this.products = data; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los productos', err);
        this.isLoading = false;
      }
    });
  }
}