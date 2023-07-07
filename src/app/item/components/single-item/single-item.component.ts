import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { of, switchMap } from 'rxjs';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Item } from '../../models/item.interface';
import { ItemService } from '../../services/item.service';

import { CartItem } from '../../../cart/models/cart.interface';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-single-item',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.scss'],
})
export class SingleItemComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  snackBar = inject(MatSnackBar);
  itemService = inject(ItemService);
  cartService = inject(CartService);

  item!: Item;

  ngOnInit(): void {
    this.getItem();
  }

  getItem() {
    this.route.params
      .pipe(
        switchMap((params) => of(params['id'])),
        switchMap((id) => {
          return this.itemService.getItem(id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((item) => {
        this.item = item;
      });
  }

  addToCart(item: Item) {
    const cartItem: CartItem = {
      _id: item._id,
      item: item,
      quantity: 1,
    };

    this.cartService.setCartItem(cartItem);
    this.openSnackBar(`You added ${cartItem.item.name} to the cart`, 'Okay');
  }

  backToShop() {
    this.router.navigateByUrl('/');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 4000,
    });
  }
}
