import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product/product.service';
import { UiService } from '../../../../core/services/ui/ui.service';
import { MovementService } from '../../../../core/services/movement/movement.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
// Asumo que tienes este servicio, ajusta la ruta si es diferente
import { PaymentFormService } from '../../../../core/services/payment-form/payment-form.service';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

@Component({
  selector: 'app-pos-dashboard',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './pos-dashboard.component.html'
})
export class PosDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private uiService = inject(UiService);
  private movementService = inject(MovementService);
  private authService = inject(AuthService);
  private paymentFormService = inject(PaymentFormService);

  products: any[] = [];
  paymentForms: any[] = [];
  cart: CartItem[] = [];

  isProcessing = false;
  cartTotal: number = 0;
  searchTerm: string = '';
  selectedPaymentFormId: number | null = null; // Para el select de método de pago

  ngOnInit() {
    this.loadProducts();
    this.loadPaymentForms();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: () => this.uiService.showToast('Error al cargar catálogo', 'error')
    });
  }

  loadPaymentForms() {
    this.paymentFormService.getPaymentForms().subscribe({
      next: (data) => this.paymentForms = data,
      error: () => console.error('Error al cargar formas de pago')
    });
  }

  addToCart(product: any) {
    if (product.quantity <= 0) {
      this.uiService.showToast('Producto sin stock', 'error');
      return;
    }

    const existingItem = this.cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity + 1 > product.quantity) {
        this.uiService.showToast('Stock máximo alcanzado', 'error');
        return;
      }
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
      this.cart.push({
        productId: product.id,
        name: product.name,
        price: product.priceSale,
        quantity: 1,
        subtotal: product.priceSale
      });
    }
    this.calculateTotal();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.calculateTotal();
  }

  updateQuantity(index: number, change: number) {
    const item = this.cart[index];
    const product = this.products.find(p => p.id === item.productId);
    
    const newQuantity = item.quantity + change;
    
    // Si baja de 1, lo quitamos del carrito
    if (newQuantity <= 0) {
      this.removeFromCart(index);
      return;
    }
    
    // Validamos que no supere el stock real
    if (product && newQuantity > product.quantity) {
      this.uiService.showToast('Stock máximo alcanzado', 'error');
      return;
    }
    
    // Aplicamos el cambio
    item.quantity = newQuantity;
    item.subtotal = item.quantity * item.price;
    this.calculateTotal();
  }

  calculateTotal() {
    this.cartTotal = this.cart.reduce((acc, item) => acc + item.subtotal, 0);
  }

 processSale() {
    // Si el carrito está vacío, no hay método de pago, o ya está procesando, bloqueamos.
    if (this.cart.length === 0 || !this.selectedPaymentFormId || this.isProcessing) return;
    
    this.isProcessing = true;

    // AGRUPACIÓN SEGURA: Unificamos forzosamente cualquier producto duplicado
    // para garantizar matemáticamente que a C# solo llegue 1 registro por producto.
    const safeDetails: any[] = [];
    this.cart.forEach(item => {
      const existing = safeDetails.find(d => d.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.subtotal += item.subtotal;
      } else {
        safeDetails.push({
          productId: item.productId,
          quantity: item.quantity,
          subtotal: item.subtotal
        });
      }
    });

    const responsible = this.authService.getUserId();
    const now = new Date().toISOString();

    const movement = {
      orderNumber: `POS-${Date.now()}`, // Genera un ticket único, ej: POS-1709238491
      orderDate: now,
      paymentDate: now,
      type: 'VENTA',
      note: 'Venta rápida de mostrador (POS)',
      total: this.cartTotal,
      responsibleId: responsible,
      paymentFormId: Number(this.selectedPaymentFormId),
      shippingMethodId: null,
      status: 1, // Completado
      details: safeDetails
    };

    this.movementService.createMovement(movement).subscribe({
      next: () => {
        this.uiService.showToast('¡Venta registrada con éxito!', 'success');
        this.cart = []; 
        this.calculateTotal();
        this.selectedPaymentFormId = null;
        this.loadProducts(); 
        this.isProcessing = false; // Desbloqueamos el sistema
      },
      error: (err) => {
        this.uiService.showToast('Error procesando la venta', 'error');
        this.isProcessing = false;
      }
    });
  }
}