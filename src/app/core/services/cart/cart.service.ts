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
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  addToCart(product: any, quantity: number = 1) {
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
    
    this.cartItems.next([...currentItems]);
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.getValue().filter(item => item.productId !== productId);
    this.cartItems.next(currentItems);
  }

  clearCart() {
    this.cartItems.next([]);
  }

  getCartTotal(): number {
    return this.cartItems.getValue().reduce((acc, item) => acc + item.subtotal, 0);
  }

  getCartItemCount(): number {
    return this.cartItems.getValue().reduce((acc, item) => acc + item.quantity, 0);
  }

  updateQuantity(productId: number, newQuantity: number) {
    const currentItems = this.cartItems.getValue();
    const itemIndex = currentItems.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      if (newQuantity > 0 && newQuantity <= currentItems[itemIndex].maxStock) {
        currentItems[itemIndex].quantity = newQuantity;
        currentItems[itemIndex].subtotal = newQuantity * currentItems[itemIndex].price;
        this.cartItems.next([...currentItems]);
      }
    }
  }
}