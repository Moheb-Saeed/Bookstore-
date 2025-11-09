import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoogleAuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  constructor(
    private googleAuth: GoogleAuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.googleAuth.initializeButton();
  }

  type: string = 'password';
  data: object = {};
  myLogForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/),
    ]),
  });

  get emailValid() {
    return this.myLogForm.controls.email;
  }
  get passwordValid() {
    return this.myLogForm.controls.password;
  }
  showHidePassword() {
    if (this.type == 'password') this.type = 'text';
    else this.type = 'password';
  }
  loginUser(password: HTMLInputElement, email: HTMLInputElement) {
    this.data = {
      email: email.value,
      password: password.value,
    };
    this.http.post('http://localhost:3000/api/v1/auth/login', this.data).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.authToken);
        localStorage.setItem('userId', res.id);
        localStorage.setItem('username', res.name);
        localStorage.setItem('email', res.email);
        localStorage.setItem('role', res.role);
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err.error?.message);
      },
    });
  }
}
