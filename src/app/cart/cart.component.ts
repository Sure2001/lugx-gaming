import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('cartItems');
    if (data) {
      this.cartItems = JSON.parse(data);
    }
  }

  get totalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeFromCart(id: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  checkout() {
    const user = localStorage.getItem('user');
    if (!user) {
      // alert('Please signup or login first');
      this.router.navigate(['/signup']);
      return;
    }

    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    localStorage.setItem('totalPrice', this.totalPrice.toString());

    this.router.navigate(['/checkout']);
  }
}
