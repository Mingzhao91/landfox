import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { of, switchMap } from 'rxjs';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.interface';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  categoryService = inject(CategoryService);
  snackBar = inject(MatSnackBar);
  isSubmitted = false;
  editMode = false;
  currentCategoryId!: string;

  categoryForm!: FormGroup;

  ngOnInit(): void {
    this.initCategoryForm();
    this.checkEditMode();
  }

  initCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      categoryType: [''],
    });
  }

  checkEditMode() {
    this.route.params
      .pipe(
        switchMap((params) => of(params['id'])),
        switchMap((id) => {
          this.editMode = id !== undefined;
          this.currentCategoryId = id;
          return id ? this.categoryService.getCategory(id) : of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((category) => {
        if (category) {
          this.categoryForm.patchValue({
            name: category.name,
            categoryType: category.categoryType,
          });
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  addCategory(category: Category) {
    this.categoryService
      .createCategory(category)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (newCategory) => {
        this.isSubmitted = false;
        const isNavigated = await this.router.navigate(['/categories/list']);

        if (isNavigated) {
          this.openSnackBar(
            `You added ${newCategory.name} as new category`,
            'Okay'
          );
        }
      });
  }

  updateCategory(category: Category) {
    this.categoryService
      .updateCategory(category)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (newCategory) => {
        this.isSubmitted = false;
        const isNavigated = await this.router.navigate(['/categories/list']);

        if (isNavigated) {
          this.openSnackBar(`You updated ${newCategory.name} category`, 'Okay');
        }
      });
  }

  onSubmit() {
    this.isSubmitted = true;
    const category: Category = {
      _id: this.currentCategoryId,
      ...this.categoryForm.getRawValue(),
    };
    this.editMode ? this.updateCategory(category) : this.addCategory(category);
  }
}
