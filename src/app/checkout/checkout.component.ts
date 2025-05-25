import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  user: any = null;
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    try {
      const userData = localStorage.getItem('user');
      if (userData) this.user = JSON.parse(userData);
      else {
        alert('Please login or sign up to place an order.');
        this.router.navigate(['/signup']);
        return;
      }

      const cartData = localStorage.getItem('cartItems');
      if (cartData) this.cartItems = JSON.parse(cartData);

      const total = localStorage.getItem('totalPrice');
      if (total) this.totalPrice = parseFloat(total);

      if (this.cartItems.length === 0 || this.totalPrice <= 0) {
        alert('Cart is empty. Please add items before checkout.');
        this.router.navigate(['/shop']);
      }
    } catch (err) {
      console.error('LocalStorage parsing error:', err);
    }
  }

  checkout(): void {
    if (!this.user?.email || this.cartItems.length === 0 || this.totalPrice <= 0) {
      alert('Incomplete order data');
      return;
    }

    const orderData = {
      userEmail: this.user.email,
      items: this.cartItems,
      totalPrice: this.totalPrice
    };

    this.http.post('http://localhost:5000/api/order/checkout', orderData).subscribe({
      next: () => {
        alert('Order placed successfully!');

        // ✅ Clear everything
        localStorage.removeItem('user');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('totalPrice');

        this.user = null;
        this.cartItems = [];
        this.totalPrice = 0;

        // ✅ Redirect to home
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Checkout failed:', err);
        alert('Checkout failed. Please try again.');
      }
    });
  }
}
