import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { CategoryService } from '../../services/category.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  categoryService = inject(CategoryService);
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
        filter((params) => params['id']),
        switchMap(({ id }) => {
          this.editMode = true;
          this.currentCategoryId = id;
          return this.categoryService.getCategory(id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((category) => {
        this.categoryForm.patchValue({
          name: category.name,
          categoryType: category.categoryType,
        });
      });
  }
}
