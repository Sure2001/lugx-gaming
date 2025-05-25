import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: any[] = [];

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(product: any) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += product.quantity;
      existing.total = existing.price * existing.quantity;
    } else {
      this.items.push({
        ...product,
        total: product.price * product.quantity
      });
    }
    this.cartItemsSubject.next(this.items);
  }

  getItems() {
    return this.items;
  }

  removeItem(id: number) {
    this.items = this.items.filter(item => item.id !== id);
    this.cartItemsSubject.next(this.items);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  clearCart() {
    this.items = [];
    this.cartItemsSubject.next(this.items);
  }
}
