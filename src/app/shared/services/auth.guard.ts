import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { LocalStorageService } from './local-storage.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getToken();

  if (token) {
    const tokenDecode = JSON.parse(atob(token.split('.')[1]));

    if (tokenDecode.isAdmin && !_tokenExpired(tokenDecode.exp)) {
      return true;
    }

    _navigateToLogin(router);
    return false;
  }

  _navigateToLogin(router);
  return false;
};

const _tokenExpired = (expiration: number): boolean => {
  return Math.floor(new Date().getTime() / 1000) >= expiration;
};

const _navigateToLogin = async (router: Router) => {
  const isNavigated = await router.navigate(['/users/login']);
  if (isNavigated) {
    alert('Please login as adminitrator');
  }
};
