import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = () => {
    return this.authService.isLoggedIn().pipe(
        map((isLoggedIn) => {
          
            if (isLoggedIn) 
              return true;

            this.router.navigate(['/auth']);
            return false;
        }));
  }
}