import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { User } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { DialogDeletionComponent } from '../../../shared/components/dialog-deletion/dialog-deletion.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  dialog = inject(MatDialog);
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);

  users!: User[];
  displayedColumns: string[] = [
    'email',
    'passwordHash',
    'isAdmin',
    'edit',
    'delete',
  ];

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.authService
      .getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => {
        this.users = users;
      });
  }

  onDeleteUser(user: User) {
    const dialogRef = this.dialog.open(DialogDeletionComponent, {
      data: { name: `this user with ${user.email}` },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.authService
          .deleteUser(user._id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            const currentUserId = this.localStorageService.getUserId();
            if (currentUserId && currentUserId === user._id) {
              // todo: logout user
            } else {
              this.getAllUsers();
            }
          });
      }
    });
  }
}
