import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { LocalStorageService } from './local-storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  localStorageService = inject(LocalStorageService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.localStorageService.getToken();
    const isAPIUrl = request.url.startsWith(environment.apiURL);

    if (token && isAPIUrl) {
      request = request.clone({
        setHeaders: {
          authorization: `Bearer %{token}`,
        },
      });
    }

    return next.handle(request);
  }
}
