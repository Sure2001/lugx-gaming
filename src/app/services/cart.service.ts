import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<any[]>(this.getCartFromStorage());
  cartItems$ = this.cartItems.asObservable();

  constructor() {}

  private getCartFromStorage(): any[] {
    const data = localStorage.getItem('cartItems');
    return data ? JSON.parse(data) : [];
  }

  getCartCount(): number {
    return this.getItems().length;
  }

  getItems(): any[] {
    return this.cartItems.getValue();
  }

  updateCart(items: any[]) {
    localStorage.setItem('cartItems', JSON.stringify(items));
    this.cartItems.next(items);
  }

  addItem(item: any) {
    const currentItems = this.getItems();
    const updatedItems = [...currentItems, item];
    this.updateCart(updatedItems);
  }

  removeItem(id: number) {
    const updatedItems = this.getItems().filter(item => item.id !== id);
    this.updateCart(updatedItems);
  }

  getTotal(): number {
    return this.getItems().reduce((sum, item) => sum + item.total, 0);
  }

  clearCart() {
    localStorage.removeItem('cartItems');
    this.cartItems.next([]);
  }
}
