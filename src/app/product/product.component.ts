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
    price: 1100,
    originalPrice: 1500,
    quantity: 1,
    image: 'assets/add-game.jpeg',
    genre: ['Action', 'Team', 'Single'],
    tags: ['War', 'Battle', 'Royal'],
    gameId: 'COD MMII'
  };

  constructor(private cartService: CartService) {}

  addToCart() {
    const existingCart = this.cartService.getItems();
    const existingIndex = existingCart.findIndex(item => item.id === this.product.id);

    if (existingIndex !== -1) {
      // Update quantity of existing item
      existingCart[existingIndex].quantity += this.product.quantity || 1;
    } else {
      // Add new item
      existingCart.push({
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: this.product.quantity || 1
      });
    }

    this.cartService.updateCart(existingCart); // update through service
    // Optionally show a popup
    // this.toastr.success('Item added to cart', 'Success');
  }

}
