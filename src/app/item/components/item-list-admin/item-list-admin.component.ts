import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Item } from '../../models/item.interface';

import { ItemService } from '../../services/item.service';
import { DialogDeletionComponent } from '../../../shared/components/dialog-deletion/dialog-deletion.component';

@Component({
  selector: 'app-item-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './item-list-admin.component.html',
  styleUrls: ['./item-list-admin.component.scss'],
})
export class ItemListAdminComponent {
  destroyRef = inject(DestroyRef);
  itemService = inject(ItemService);
  router = inject(Router);
  dialog = inject(MatDialog);

  items!: Item[];
  displayedColumns: string[] = [
    'name',
    'description',
    'price',
    'image',
    'category',
    'edit',
    'delete',
  ];

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    this.itemService
      .getItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.items = items;
        console.log(items);
      });
  }

  onDeleteItem(item: Item) {
    const dialogRef = this.dialog.open(DialogDeletionComponent, {
      data: { name: item.name },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.itemService
          .deleteItem(item._id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.getItems();
          });
      }
    });
  }
}
