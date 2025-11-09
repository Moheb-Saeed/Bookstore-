import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cancel-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cancel-page.html',
  styleUrl: './cancel-page.css',
})
export class CancelPage {
  constructor(private router: Router) {}

  backToHome(): void {
    this.router.navigate(['/']);
  }
}
