import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User, UserLoginResponse } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  apiURLUser = `${environment.apiURL}/user`;

  login(email: string, password: string): Observable<UserLoginResponse> {
    return this.http
      .post<UserLoginResponse>(`${this.apiURLUser}/login`, {
        email,
        password,
      })
      .pipe(
        map((userInfo) => {
          localStorage.setItem('user', userInfo.user);

          localStorage.setItem(
            'userAdmin',
            JSON.stringify(userInfo.isAdmin !== undefined)
          );

          this.router.navigateByUrl('/');
          return userInfo;
        })
      );
  }

  signup(email: string, password: string, isAdmin?: boolean): Observable<User> {
    return this.http.post<User>(`${this.apiURLUser}/register`, {
      email,
      password,
      isAdmin,
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUser);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUser}/${userId}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiURLUser}/register`, user);
  }

  updateUser(user: User, userId: string): Observable<User> {
    return this.http.put<User>(`${this.apiURLUser}/${userId}`, user);
  }

  deleteUser(userId: string): Observable<User> {
    return this.http.delete<User>(`${this.apiURLUser}/${userId}`);
  }
}
