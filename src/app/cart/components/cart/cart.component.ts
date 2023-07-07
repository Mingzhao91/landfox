import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Cart, CartItem } from '../../models/cart.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../services/cart.service';
import { ItemService } from '../../../item/services/item.service';
import { take } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  snackBar = inject(MatSnackBar);
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  removeItem(index: number, cartItem: CartItem) {
    this.cartService.removeItem(index);
    this.openSnackBar(
      `You deleted ${cartItem.item.name} from the cart`,
      'Okay'
    );
  }
}
