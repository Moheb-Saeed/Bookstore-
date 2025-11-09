import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-page.html',
  styleUrls: ['./about-page.css'],
})
export class AboutPage {
  branches = [
    {
      city: 'Kurunegala',
      address: 'Main Street, City Center',
      contact: 'Contact: 123-456-7890',
      hours: 'Operating Hours: Monday to Saturday, 9 AM - 7 PM; Sunday, 10 AM - 5 PM',
      extras: 'In-store shopping. Special discounts for students, Workshops, Study spaces',
    },
    {
      city: 'Kandy',
      address: 'Main Street, City Center',
      contact: 'Contact: 123-456-7891',
      hours: 'Operating Hours: Monday to Saturday, 9 AM - 7 PM; Sunday, 10 AM - 5 PM',
      extras: 'In-store shopping. Special discounts for students, Workshops, Study spaces',
    },
    {
      city: 'Colombo',
      address: 'Main Street, City Center',
      contact: 'Contact: 123-456-7892',
      hours: 'Operating Hours: Monday to Saturday, 9 AM - 7 PM; Sunday, 10 AM - 5 PM',
      extras: 'In-store shopping. Special discounts for students, Workshops, Study spaces',
    },
  ];
}
