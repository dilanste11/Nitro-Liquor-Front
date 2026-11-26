import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../../core/services/cart/cart.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AddressService } from '../../../core/services/address/address.service';
import { CheckoutService } from '../../../core/services/checkout/checkout.service';
import { ShippingMethodService } from '../../../core/services/shipping-method/shipping-method.service';
import { UiService } from '../../../core/services/ui/ui.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  public cartService = inject(CartService);
  public authService = inject(AuthService);
  private addressService = inject(AddressService);
  private checkoutService = inject(CheckoutService);
  private shippingMethodService = inject(ShippingMethodService);
  private uiService = inject(UiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  cartItems: CartItem[] = [];
  addresses: any[] = [];
  shippingMethods: any[] = [];
  paymentForms: any[] = [
    { id: 1, name: 'Contra entrega (Efectivo)' },
    { id: 2, name: 'Transferencia Bancaria' }
    // Nota: Si tienes un PaymentFormService de tu POS, inyéctalo y carga esto desde el backend
  ];
  
  isLoggedIn = false;
  userId = 0;
  isProcessing = false;

  // Variables de Checkout
  addressOption: 'saved' | 'new' = 'saved';
  selectedAddressId: number | null = null;
  selectedShippingMethodId: number | null = null;
  selectedPaymentFormId: number | null = null;
  shippingCost: number = 0;
  
  newAddressForm: FormGroup = this.fb.group({
    document: [''],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    companyName: [''],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['Colombia', Validators.required],
    postalCode: ['']
  });

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.isLoggedIn = this.authService.isAuthenticated();
    this.userId = this.authService.getUserId();

    if (this.isLoggedIn && this.userId > 0) {
      this.newAddressForm.patchValue({
        name: this.authService.getUserName(),
        email: this.authService.getUserEmail()
      });
      this.loadAddresses();
    }

    this.loadCheckoutOptions();
  }

  loadAddresses() {
    this.addressService.getAddressesByUserId(this.userId).subscribe({
      next: (data) => {
        this.addresses = data;
        if (data.length > 0) {
          this.selectedAddressId = data[0].id;
        } else {
          this.addressOption = 'new';
        }
      },
      error: () => console.error('Error al cargar direcciones')
    });
  }

  loadCheckoutOptions() {
    this.shippingMethodService.getActive().subscribe({
      next: (data) => {
        this.shippingMethods = data;
        if (data.length > 0) {
          this.onShippingChange(data[0].id); // Selecciona el primero por defecto
        }
      },
      error: () => console.error('Error al cargar métodos de envío')
    });
  }

  onShippingChange(methodId: number | string) {
    this.selectedShippingMethodId = Number(methodId);
    const method = this.shippingMethods.find(m => m.id === this.selectedShippingMethodId);
    this.shippingCost = method ? method.price : 0;
  }

  getFinalTotal(): number {
    return this.cartService.getCartTotal() + this.shippingCost;
  }

  updateQuantity(productId: number, currentQuantity: number, change: number) {
    this.cartService.updateQuantity(productId, currentQuantity + change);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  processCheckout() {
    if (!this.isLoggedIn) {
      this.uiService.showToast('Por favor inicia sesión para continuar', 'success');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedShippingMethodId || !this.selectedPaymentFormId) {
      this.uiService.showToast('Selecciona un método de envío y de pago', 'error');
      return;
    }

    const formattedItems = this.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));

    const checkoutPayload: any = {
      items: formattedItems,
      totalAmount: this.getFinalTotal(), // Total real con el envío sumado
      paymentFormId: this.selectedPaymentFormId,
      shippingMethodId: this.selectedShippingMethodId,
      addressOption: this.addressOption
    };

    if (this.addressOption === 'saved') {
      if (!this.selectedAddressId) {
        this.uiService.showToast('Debes seleccionar una dirección de envío', 'error');
        return;
      }
      checkoutPayload.savedAddressId = this.selectedAddressId;
    } else {
      if (this.newAddressForm.invalid) {
        this.newAddressForm.markAllAsTouched();
        this.uiService.showToast('Por favor completa los campos de la nueva dirección', 'error');
        return;
      }
      checkoutPayload.newAddressData = this.newAddressForm.value;
    }

    this.isProcessing = true;

    this.checkoutService.processCheckout(checkoutPayload).subscribe({
      next: (response: any) => {
        this.uiService.showToast('¡Pedido realizado con éxito!', 'success');
        this.cartService.clearCart();
        this.isProcessing = false;
        this.router.navigate(['/checkout/success', response.orderId]);
      },
      error: (err) => {
        this.uiService.showToast(err.error?.message || 'Error al procesar el pedido', 'error');
        this.isProcessing = false;
      }
    });
  }
}