import { Injectable, inject } from '@angular/core';

import { Cart, CartItem } from '../models/cart.interface';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { BehaviorSubject } from 'rxjs';

const CART = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor(private localStorageService: LocalStorageService) {
    this.initialCartLocalStorage();
  }

  initialCartLocalStorage() {
    const cart: Cart = this.getCart();

    if (!cart) {
      const initialCart = {
        cartItems: [],
        user: {},
      };
      const initialCartJson = JSON.stringify(initialCart);
      localStorage.setItem(CART, initialCartJson);
    }
  }

  getCart(): Cart {
    const cartJsonString = localStorage.getItem(CART);
    return cartJsonString ? JSON.parse(cartJsonString) : null;
  }

  setCartItem(cartItem: CartItem) {
    const cart = this.getCart();
    const cartItemExist = cart.cartItems.find(
      (item) => item.item._id === cartItem.item._id
    );

    if (cartItemExist) {
      cart.cartItems.map((item) => {
        if (item.item._id === cartItem.item._id) {
          item.quantity = item.quantity + cartItem.quantity;
        }
      });
    } else {
      const user = this.localStorageService.getUserId();

      if (user) {
        cart.cartItems.push(cartItem);
        cart.user = user;
      }
    }

    this.storeAndEmitCart(cart);

    return cart;
  }

  removeItem(index: number) {
    const cart = this.getCart();
    cart.cartItems.splice(index, 1);
    this.storeAndEmitCart(cart);
  }

  storeAndEmitCart(cart: Cart) {
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART, cartJson);
    this.cart$.next(cart);
  }
}
