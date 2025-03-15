import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from "../../components/login-form/login-form.component";
import { RegistrationFormComponent } from "../../components/registration-form/registration-form.component";

export enum AuthState {
  LOGIN,
  REGISTER
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RegistrationFormComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent {

  state: AuthState = AuthState.LOGIN;
  AuthState = AuthState;

  onRegister() {
    this.state = AuthState.REGISTER;
  }

  onLogin() {
    this.state = AuthState.LOGIN;
  }
}
