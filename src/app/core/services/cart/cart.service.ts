import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  maxStock: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'nitro_liquor_cart';
  private cartItems = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  public cartItems$ = this.cartItems.asObservable();

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveAndEmit(items: CartItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.cartItems.next([...items]);
  }

  addToCart(product: any, quantity: number = 1): void {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.productId === product.id);

    if (existingItem) {
      if (existingItem.quantity + quantity <= existingItem.maxStock) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      }
    } else {
      currentItems.push({
        productId: product.id,
        name: product.name,
        price: product.priceSale,
        quantity: quantity,
        imageUrl: product.imageUrl,
        maxStock: product.quantity,
        subtotal: product.priceSale * quantity
      });
    }

    this.saveAndEmit(currentItems);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.getValue().filter(item => item.productId !== productId);
    this.saveAndEmit(currentItems);
  }

  clearCart(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.cartItems.next([]);
  }

  getCartTotal(): number {
    return this.cartItems.getValue().reduce((acc, item) => acc + item.subtotal, 0);
  }

  getCartItemCount(): number {
    return this.cartItems.getValue().reduce((acc, item) => acc + item.quantity, 0);
  }

  updateQuantity(productId: number, newQuantity: number): void {
    const currentItems = this.cartItems.getValue();
    const itemIndex = currentItems.findIndex(item => item.productId === productId);

    if (itemIndex > -1 && newQuantity > 0 && newQuantity <= currentItems[itemIndex].maxStock) {
      currentItems[itemIndex].quantity = newQuantity;
      currentItems[itemIndex].subtotal = newQuantity * currentItems[itemIndex].price;
      this.saveAndEmit(currentItems);
    }
  }
}