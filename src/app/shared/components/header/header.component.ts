import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatBadgeModule],
})
export class HeaderComponent implements OnInit {
  cartService = inject(CartService);
  destroyRef = inject(DestroyRef);

  cartCount = 0;

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cart) => {
        this.cartCount = cart.cartItems.length ?? 0;
      });
  }
}
