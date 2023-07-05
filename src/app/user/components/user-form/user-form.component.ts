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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { of, switchMap } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-user-form',
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
    MatSlideToggleModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  isSubmitted = false;
  editMode = false;
  currentUserId!: string;
  currentUserPasswordHash!: string;

  userForm!: FormGroup;

  ngOnInit(): void {
    this.initUserForm();
    this.checkEditMode();
  }

  initUserForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      isAdmin: [false],
    });
  }

  checkEditMode() {
    this.route.params
      .pipe(
        switchMap((params) => of(params['id'])),
        switchMap((id) => {
          this.editMode = id !== undefined;
          this.currentUserId = id;
          return id ? this.authService.getUser(id) : of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((user) => {
        if (user) {
          this.currentUserPasswordHash = user.passwordHash as string;
          this.userForm.patchValue({
            email: user.email,
            password: user.passwordHash,
            isAdmin: user.isAdmin,
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

  addUser(user: User) {
    this.authService
      .createUser(user)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (newUser) => {
        this.isSubmitted = false;
        const isNavigated = await this.router.navigate(['/users/list']);

        if (isNavigated) {
          this.openSnackBar(
            `You added new user with email ${newUser.email}`,
            'Okay'
          );
        }
      });
  }

  updateUser(user: User) {
    this.authService
      .updateUser(user, user._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (newUser) => {
        this.isSubmitted = false;
        const isNavigated = await this.router.navigate(['/users/list']);

        if (isNavigated) {
          this.openSnackBar(
            `You updated user with email ${newUser.email}`,
            'Okay'
          );
        }
      });
  }

  onSubmit() {
    this.isSubmitted = true;
    const user: User = {
      _id: this.currentUserId,
      email: this.userForm.get('email')?.value,
      isAdmin: this.userForm.get('isAdmin')?.value,
      password:
        this.editMode &&
        this.userForm.get('password')?.value === this.currentUserPasswordHash
          ? ''
          : this.userForm.get('password')?.value,
    };

    this.editMode ? this.updateUser(user) : this.addUser(user);
  }
}
