import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Item } from '../../models/item.interface';
import { Category } from '../../../category/models/category.interface';

import { ItemService } from '../../services/item.service';
import { CategoryService } from '../../../category/services/category.service';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  itemService = inject(ItemService);
  categoryService = inject(CategoryService);

  items!: Item[];
  categories!: Category[];

  ngOnInit(): void {
    this.getItems();
    this.getCategories();
  }

  getItems() {
    this.itemService
      .getItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.items = items;
      });
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  forwardToSingleItem(itemId: string) {}
}
