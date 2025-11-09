import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Book {
  _id: string;
  title: string;
  author: string;
  bookCoverImage: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class HomePage implements OnInit {
  heroImage = '/assets/home-hero.png';
  bestPicks: Book[] = [];
  bookSlides: Book[][] = [];
  shelfImage = '/assets/bookshelf.png';
  currentSlide = 0;
  totalSlides = 3;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Book[]>('http://localhost:3000/api/v1/books').subscribe({
      next: (books) => {
        console.log('Received books:', books);
        this.bestPicks = books.slice(0, 12);
        this.bookSlides = this.groupIntoSlides(this.bestPicks, 4);
      },
      error: (error) => {
        console.error('Error fetching books:', error);
      },
    });
  }

  groupIntoSlides(books: Book[], booksPerSlide: number): Book[][] {
    const slides: Book[][] = [];
    for (let i = 0; i < books.length; i += booksPerSlide) {
      slides.push(books.slice(i, i + booksPerSlide));
    }
    return slides;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }
}
