import {
  Component,
  DestroyRef,
  NgZone,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
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
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { filter, of, switchMap, take } from 'rxjs';

import { Category } from 'src/app/category/models/category.interface';
import { ItemService } from '../../services/item.service';
import { CategoryService } from 'src/app/category/services/category.service';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
})
export class ItemFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  _ngZone = inject(NgZone);
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  itemService = inject(ItemService);
  categoryService = inject(CategoryService);

  snackBar = inject(MatSnackBar);
  itemForm!: FormGroup;
  categories!: Category[];
  imageDisplay!: string | ArrayBuffer;
  editMode = false;
  currentItemId!: string;
  isSubmitted = false;

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngOnInit(): void {
    this.getCategories();
    this.initItemForm();
    this.checkEditMode();
  }

  initItemForm() {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      image: [''],
      category: ['', Validators.required],
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

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.itemForm.patchValue({ image: file });
      this.itemForm.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result as string | ArrayBuffer;
      };

      fileReader.readAsDataURL(file);
    }
  }

  checkEditMode() {
    this.route.params
      .pipe(
        switchMap((params) => of(params['id'])),
        switchMap((id) => {
          this.editMode = true;
          this.currentItemId = id;
          return this.itemService.getItem(id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((item) => {
        this.imageDisplay = item.image;

        this.itemForm.patchValue({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category._id,
        });
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  addItem(item: FormData) {
    this.itemService
      .createItem(item)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (newItem) => {
        this.isSubmitted = false;
        const isNavigated = await this.router.navigate(['/items/list']);

        if (isNavigated) {
          this.openSnackBar(`You added ${newItem.name} as new item`, 'Okay');
        }
      });
  }

  updateItem(item: FormData) {
    this.itemService
      .updateItem(item, this.currentItemId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (newItem) => {
        this.isSubmitted = false;
        const isNavigated = await this.router.navigate(['/items/list']);

        if (isNavigated) {
          this.openSnackBar(`You updated ${newItem.name} item`, 'Okay');
        }
      });
  }

  onSubmit() {
    this.isSubmitted = true;

    const itemData = new FormData();
    itemData.append('name', this.itemForm.get('name')?.value);
    itemData.append('description', this.itemForm.get('description')?.value);
    itemData.append('price', this.itemForm.get('price')?.value);
    itemData.append('image', this.itemForm.get('image')?.value);
    itemData.append('category', this.itemForm.get('category')?.value);

    this.editMode ? this.updateItem(itemData) : this.addItem(itemData);
  }
}
