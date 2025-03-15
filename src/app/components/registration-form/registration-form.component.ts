import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule , Validators } from '@angular/forms';
import { ErrorComponent } from '../error/error.component';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ErrorComponent],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {

  authService = inject(AuthService)
  @Output() loginClicked = new EventEmitter();

  passwordForm: FormGroup;
  error: string|null = null;

  constructor() {

    this.passwordForm = new FormGroup({
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      //  Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    });

    this.passwordForm.setValidators(this.passwordMatchValidator);
  }

  passwordMatchValidator(control: AbstractControl) {
    const form = control as FormGroup;
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.error = null;
    if (!this.passwordForm.valid) return;

    let login = this.passwordForm.get('login')?.value;
    let password = this.passwordForm.get('password')?.value;
     
    this.authService.register(login, password)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.onLogin();
        },
        error: (e: HttpErrorResponse) => {
          if (e.status === 400) {
            this.error = "Invalid login or password";
          } else {
            this.error = "Internal error";
          }
        }
      });
  }

  onLogin() {
    this.loginClicked.emit();
  }
}
