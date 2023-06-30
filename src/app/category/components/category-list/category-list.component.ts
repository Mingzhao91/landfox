import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    CategoryDialogComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent {
  destroyRef = inject(DestroyRef);
  dialog = inject(MatDialog);
  categories!: Category[];
  categoryService = inject(CategoryService);
  displayedColumns: string[] = ['name', 'categoryType', 'edit', 'delete'];

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  onDeleteCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: { name: category.name },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.categoryService
          .deleteCategory(category._id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.getCategories();
          });
      }
    });
  }
}
