import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoogleAuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  constructor(private googleAuth: GoogleAuthService, private router: Router) {}
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
  addUser(
    firstName: HTMLInputElement,
    lastName: HTMLInputElement,
    password: HTMLInputElement,
    email: HTMLInputElement
  ) {
    this.data = {
      name: firstName.value + ' ' + lastName.value,
      email: email.value,
      password: password.value,
    };
    console.log(this.data);
    this.googleAuth.register(this.data).subscribe({
      next: (res) => {
        console.log('✅ User registered successfully:', res);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
      },
    });
  }
}
