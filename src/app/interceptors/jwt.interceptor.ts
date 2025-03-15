import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const excludedUrls = ['/storage']; //because we don't need to send JWT token to the storage service

    if (excludedUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    const accessToken = this.authService.getAccessToken();

    const clonedReq = accessToken
      ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${accessToken}`) })
      : req;

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap((newAccessToken: string) => {
        const retryReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`),
        });
        return next.handle(retryReq);
      }),
      catchError((refreshError) => {
        this.authService.logout();
        return throwError(() => refreshError);
      })
    );
  }
}