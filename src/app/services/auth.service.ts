import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegistrationRequest } from '../dto/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private accessToken: string | null = null;

  private registerEndpoint = `${environment.baseUrl}/api/auth/register`;
  private loginEndpoint = `${environment.baseUrl}/api/auth/login`;
  private refreshTokenEndpoint = `${environment.baseUrl}/api/auth/refresh`;

  constructor(private http: HttpClient) {}

  getAccessToken(): string | null {
    return this.accessToken;
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ accessToken: string }>(this.refreshTokenEndpoint, {}, { withCredentials: true })
      .pipe(
        tap(response => {
          this.accessToken = response.accessToken;
        }),
        switchMap(response => response.accessToken)
      );
  }

  isLoggedIn(): Observable<boolean> {

    if (this.accessToken) {
      return of(true);
    }

    return this.refreshToken().pipe(
      map(() => true), 
      catchError(() => of(false))
    );
  }

  register(login: string, password: string): Observable<HttpResponse<string>> {
    
    let request: RegistrationRequest = {username: login, password: password}; 
    return this.http.post<HttpResponse<string>>(this.registerEndpoint,
      request, { withCredentials: true });
  }

  login(login: string, password: string): Observable<LoginResponse> {
    
    let request: LoginRequest = {username: login, password: password}; 
    return this.http.post<LoginResponse>(this.loginEndpoint, 
      request, { withCredentials: true })
      .pipe(
        tap(response => {
          this.accessToken = response.accessToken;
        })
      );
  }

  logout(): void {
    this.http.post(`${environment.baseUrl}/api/auth/logout`, {}, { withCredentials: true })
    .subscribe({
      next: () => {
        this.accessToken = null;
      },
      error: (err) => {
        console.error("Error during logout:", err);
      },
    });
  }
}