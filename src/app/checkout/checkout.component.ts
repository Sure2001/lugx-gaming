// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css']
// })
// export class CheckoutComponent implements OnInit {
//   user: any = null;
//   cartItems: any[] = [];
//   totalPrice: number = 0;

//   constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit(): void {
//   try {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       this.user = { email: userData }; // ✅ wrap in object
//     } else {
//       alert('Please login or sign up to place an order.');
//       this.router.navigate(['/signup']);
//       return;
//     }

//     const cartData = localStorage.getItem('cartItems');
//     if (cartData) this.cartItems = JSON.parse(cartData);

//     const total = localStorage.getItem('totalPrice');
//     if (total) this.totalPrice = parseFloat(total);

//     if (this.cartItems.length === 0 || this.totalPrice <= 0) {
//       alert('Cart is empty. Please add items before checkout.');
//       this.router.navigate(['/checkout']);
//     }
//   } catch (err) {
//     console.error('LocalStorage parsing error:', err);
//   }
// }

//   checkout(): void {
//     if (!this.user?.email || this.cartItems.length === 0 || this.totalPrice <= 0) {
//       alert('Incomplete order data');
//       return;
//     }

//     const orderData = {
//       userEmail: this.user.email,
//       items: this.cartItems,
//       totalPrice: this.totalPrice  // camelCase here
//     };

//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

//     this.http.post('http://localhost:5000/api/order/create', orderData, { headers }).subscribe({
//       next: () => {
//         alert('Order placed successfully!');

//         // Clear only checkout related data
//         localStorage.removeItem('user');
//         localStorage.removeItem('cartItems');
//         localStorage.removeItem('totalPrice');

//         this.router.navigate(['/']);
//       },
//       error: (err) => {
//         console.error('Checkout failed:', err);
//         alert('Checkout failed. Please try again.');
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service'; // ✅ Import CartService

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  user: any = null;
  cartItems: any[] = [];
  totalPrice: number = 0;
  cartCount: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService // ✅ Inject CartService
  ) {}

  ngOnInit(): void {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = { email: userData };
      } else {
        alert('Please login or sign up to place an order.');
        this.router.navigate(['/signup']);
        return;
      }

      this.cartItems = this.cartService.getItems(); // ✅ Use CartService
      this.totalPrice = this.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      this.cartCount = this.cartService.getCartCount(); // ✅ Show cart count

      if (this.cartItems.length === 0 || this.totalPrice <= 0) {
        alert('Cart is empty. Please add items before checkout.');
        this.router.navigate(['/']);
      }
    } catch (err) {
      console.error('Cart loading error:', err);
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

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('http://localhost:5000/api/order/create', orderData, { headers }).subscribe({
      next: () => {
        // alert('Order placed successfully!');

        // Clear cart and cart count via CartService
        this.cartService.clearCart();

        //Clear user only (cart is already cleared above)
        localStorage.removeItem('user');

        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Checkout failed:', err);
        // alert('Checkout failed. Please try again.');
      }
    });
  }
}
