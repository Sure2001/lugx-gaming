import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  product = {
    id: 1,
    name: 'Call of Duty®: Modern Warfare® II',
    description: 'LUGX Gaming Template is based on the latest Bootstrap 5 CSS framework. This template is suitable for your gaming shop ecommerce websites.',
    price: 22,
    originalPrice: 28,
    quantity: 1,
    image: 'assets/banner-03.png',
    genre: ['Action', 'Team', 'Single'],
    tags: ['War', 'Battle', 'Royal'],
    gameId: 'COD MMII'
  };

  constructor(private cartService: CartService) {}

  addToCart() {
  const cartData = localStorage.getItem('cartItems');
  let cartItems = cartData ? JSON.parse(cartData) : [];

  const existingIndex = cartItems.findIndex((item: any) => item.id === this.product.id);

  if (existingIndex !== -1) {
    cartItems[existingIndex].quantity += this.product.quantity || 1;
  } else {
    cartItems.push({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.product.quantity || 1
    });
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  alert('Item added to cart');
}

}
