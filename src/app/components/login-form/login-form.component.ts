import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { ErrorComponent } from "../error/error.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, ErrorComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  authService: AuthService = inject(AuthService)
  @Output() registerClicked = new EventEmitter();

  router = inject(Router);

  login: string = '';
  password: string = '';
  error: string|null = null;

  onSubmit() {
    this.error = null
    this.authService.login(this.login, this.password)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (e: HttpErrorResponse) => {
          if (e.status === 400) {
            this.error = "Invalid login or password";
          } else {
            this.error = e.error.message ?? "Internal error";
          }
        }
      });
  }

  onRegister() {
    this.registerClicked.emit();
  }

}
