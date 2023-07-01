import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';

import { Item } from '../../../item/models/item.interface';
import { Category } from '../../../category/models/category.interface';

@Component({
  selector: 'app-dialog-deletion',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './dialog-deletion.component.html',
  styleUrls: ['./dialog-deletion.component.scss'],
})
export class DialogDeletionComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeletionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item | Category
  ) {}
}
