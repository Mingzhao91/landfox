import { Injectable } from '@angular/core';

const TOKEN = 'jwt-token';
const USER_ID = 'user';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setToken(data: any) {
    localStorage.setItem(TOKEN, data);
  }

  getToken() {
    return localStorage.getItem(TOKEN);
  }

  removeToken() {
    localStorage.removeItem(TOKEN);
  }

  getUserId() {
    return localStorage.getItem(USER_ID);
  }
}
