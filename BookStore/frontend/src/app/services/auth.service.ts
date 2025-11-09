// src/app/services/google-auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private clientId = '840442962743-kc23jk1m59fr8cgl8f3c12sa3go1iraa.apps.googleusercontent.com';

  constructor(private ngZone: NgZone, private http: HttpClient, private router: Router) {}

  register(userData: any) {
    return this.http.post('http://localhost:3000/api/v1/auth/register', userData);
  }

  login(userData: any) {
    return this.http.post('http://localhost:3000/api/v1/auth/login', userData);
  }

  initializeButton() {
    const el = document.getElementById('google-signin-button');

    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    google.accounts.id.renderButton(el, {
      theme: 'filled_black',
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
      logo_alignment: 'left',
    });
  }

  private handleCredentialResponse(response: any) {
    const token = response.credential;
    const decoded: any = jwtDecode(token);
    this.ngZone.run(() => {
      const data = {
        name: decoded.name,
        email: decoded.email,
        password: decoded.sub,
      };
      this.http.post('http://localhost:3000/api/v1/auth/login', data).subscribe({
        next: (res: any) => {
          this.loginAfterRegister(res);
        },
        error: (err) => {
          console.log(err);
          this.http.post('http://localhost:3000/api/v1/auth/register', data).subscribe({
            next: (res: any) => {
              console.log('done');
              this.http.post('http://localhost:3000/api/v1/auth/login', data).subscribe({
                next: (res: any) => {
                  this.loginAfterRegister(res);
                },
              });
            },
          });
        },
      });
    });
  }
  private loginAfterRegister(res: any) {
    localStorage.setItem('token', res.authToken);
    localStorage.setItem('userId', res.id);
    localStorage.setItem('username', res.name);
    localStorage.setItem('email', res.email);
    localStorage.setItem('role', res.role);
    this.router.navigate(['/']);
  }
}
