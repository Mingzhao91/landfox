import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { of, switchMap } from 'rxjs';

import { Item } from '../../models/item.interface';
import { ItemService } from '../../services/item.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-single-item',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.scss'],
})
export class SingleItemComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  itemService = inject(ItemService);

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

  addToCart(item: Item) {}

  backToShop() {
    this.router.navigateByUrl('/');
  }
}
