import { Component, DestroyRef, DoCheck, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

import { CartService } from '../../../cart/services/cart.service';
import { Cart } from '../../../cart/models/cart.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
  ],
})
export class HeaderComponent implements OnInit, DoCheck {
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  cartService = inject(CartService);

  cartCount = 0;
  userIsAdmin = false;

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cart) => {
        this.cartCount = cart.cartItems.length ?? 0;
      });
  }

  ngDoCheck() {
    const isAdmin = localStorage.getItem('userAdmin') || 'false';
    this.userIsAdmin = JSON.parse(isAdmin);
  }

  isLoggedIn() {
    return localStorage.getItem('user') !== null;
  }

  logout() {
    const initialCart = {
      cartItems: [],
      user: {},
    };
    const initialCartJson = JSON.stringify(initialCart);
    localStorage.setItem('cart', initialCartJson);

    const cartJsonString: string | null = localStorage.getItem('cart');

    const cart: Cart = cartJsonString
      ? JSON.parse(cartJsonString)
      : initialCart;

    this.cartService.cart$.next(cart);
    localStorage.removeItem('user');
    localStorage.setItem('userAdmin', JSON.stringify(false));
    this.router.navigateByUrl('/users/login');
  }
}
