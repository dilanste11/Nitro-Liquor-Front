import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../../core/services/product/product.service';
// Ajusta la ruta de tu servicio de proveedores según cómo lo tengas:
import { ProviderService } from '../../../../core/services/provider/provider.service'; 
import { SupplierOrderService } from '../../../../core/services/supplier-order/supplier-order.service';
import { UiService } from '../../../../core/services/ui/ui.service';
import { AuthService } from '../../../../core/services/auth/auth.service';

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

@Component({
  selector: 'app-supplier-order-form',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './supplier-order-form.component.html'
})
export class SupplierOrderFormComponent implements OnInit {
  private productService = inject(ProductService);
  private providerService = inject(ProviderService);
  private supplierOrderService = inject(SupplierOrderService);
  private uiService = inject(UiService);
  private authService = inject(AuthService);

  suppliers: any[] = [];
  products: any[] = [];
  orderItems: OrderItem[] = [];
  
  // Datos del formulario
  selectedSupplierId: number | null = null;
  orderType: string = 'COMPRA DIRECTA';
  observation: string = '';
  
  searchTerm: string = '';
  orderTotal: number = 0;
  isProcessing = false;

  ngOnInit() {
    this.loadSuppliers();
    this.loadProducts();
  }

  loadSuppliers() {
    this.providerService.getProviders().subscribe({
      next: (data) => this.suppliers = data,
      error: () => this.uiService.showToast('Error al cargar proveedores', 'error')
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: () => this.uiService.showToast('Error al cargar productos', 'error')
    });
  }

  addProductToOrder(product: any) {
    const existing = this.orderItems.find(item => item.productId === product.id);
    if (existing) {
      this.uiService.showToast('El producto ya está en la lista', 'error');
      return;
    }

    this.orderItems.push({
      productId: product.id,
      name: product.name,
      quantity: 1,
      unitCost: product.pricePurchase || 0, // Traemos el costo por defecto de la BD
      subtotal: product.pricePurchase || 0
    });
    this.calculateTotal();
  }

  removeProduct(index: number) {
    this.orderItems.splice(index, 1);
    this.calculateTotal();
  }

  updateItem(index: number) {
    const item = this.orderItems[index];
    if (item.quantity < 1) item.quantity = 1;
    if (item.unitCost < 0) item.unitCost = 0;
    
    item.subtotal = item.quantity * item.unitCost;
    this.calculateTotal();
  }

  calculateTotal() {
    this.orderTotal = this.orderItems.reduce((acc, item) => acc + item.subtotal, 0);
  }

  get filteredProducts() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.products;
    return this.products.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.reference?.toLowerCase().includes(term)
    );
  }

  processOrder() {
    if (!this.selectedSupplierId) {
      this.uiService.showToast('Seleccione un proveedor', 'error');
      return;
    }
    if (this.orderItems.length === 0) {
      this.uiService.showToast('Agregue al menos un producto a la orden', 'error');
      return;
    }

    this.isProcessing = true;
    
    // Armamos el DTO exactamente como lo espera C#
    const payload = {
      SupplierId: Number(this.selectedSupplierId),
      ResponsibleId: this.authService.getUserId(),
      OrderType: this.orderType,
      Observation: this.observation,
      Details: this.orderItems.map(item => ({
        ProductId: item.productId,
        Quantity: item.quantity,
        UnitCost: item.unitCost
      }))
    };

    this.supplierOrderService.createOrder(payload).subscribe({
      next: () => {
        this.uiService.showToast('¡Mercancía ingresada con éxito!', 'success');
        this.orderItems = [];
        this.selectedSupplierId = null;
        this.observation = '';
        this.calculateTotal();
        this.isProcessing = false;
      },
      error: (err) => {
        this.uiService.showToast('Error al procesar la orden', 'error');
        this.isProcessing = false;
      }
    });
  }
}