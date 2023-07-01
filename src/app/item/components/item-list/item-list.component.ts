import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { Item } from '../../models/item.interface';
import { Category } from '../../../category/models/category.interface';

import { ItemService } from '../../services/item.service';
import { CategoryService } from '../../../category/services/category.service';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  itemService = inject(ItemService);
  categoryService = inject(CategoryService);
  router = inject(Router);

  items!: Item[];
  categories!: Category[];
  filterByCategory: string = '';
  showAll = true;

  searchForm!: FormGroup;
  filterByName: string = '';

  ngOnInit(): void {
    this.getItems();
    this.getCategories();
    this.initSearchForm();
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

  initSearchForm() {
    this.searchForm = this.formBuilder.group({
      term: [''],
    });
  }

  filterItems(value: string) {
    this.filterByCategory = value;
  }

  onSubmit() {
    this.filterByName = this.searchForm.get('term')?.value.trim();
  }

  showItem(item: Item) {
    let isShown = false;
    let shownByCategory = false;
    let shownBySearch = false;

    shownByCategory =
      this.filterByCategory === 'All' ||
      item.category.name === this.filterByCategory ||
      this.filterByCategory === '';

    shownBySearch =
      (this.filterByName.length > 0 &&
        item.name.toLocaleLowerCase().includes(this.filterByName)) ||
      this.filterByName.length === 0;

    isShown = shownByCategory && shownBySearch;

    return isShown;
  }

  forwardToSingleItem(itemId: string) {
    this.router.navigate([`/items/single-item/${itemId}`]);
  }
}
