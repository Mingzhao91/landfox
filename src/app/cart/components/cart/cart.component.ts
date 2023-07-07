import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Cart, CartItem } from '../../models/cart.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { CartService } from '../../services/cart.service';
import { ItemService } from '../../../item/services/item.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  cartService = inject(CartService);
  itemService = inject(ItemService);

  cartItems: CartItem[] = [];
  respCart!: Cart;
  totalPrice!: number;

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems() {
    this.cartService.cart$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((respCart) => {
        this.cartItems = [];
        this.respCart = respCart;
        respCart.cartItems.forEach((cartItem) => {
          this.itemService
            .getItem(cartItem.item._id)
            .pipe(take(1))
            .subscribe((item) => {
              this.totalPrice = item.price * cartItem.quantity;
              this.cartItems.push({
                item,
                quantity: cartItem.quantity,
              });
            });
        });
      });
  }

  removeItem(index: number, item: CartItem) {}
}
