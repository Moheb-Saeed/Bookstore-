import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Book {
  _id: string;
  title: string;
  author: string;
  bookCoverImage: string;
  price: number;
  reviews?: Array<{
    comment: string;
    rating: number;
  }>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  recommendedBooks: Book[] = [];
  featuredBook: Book | null = null;
  
  navLinks = [
    { icon: 'book', label: 'Books', active: true },
    { icon: 'category', label: 'Categories', active: false },
    { icon: 'favorite_border', label: 'Favorites', active: false },
    { icon: 'group', label: 'Users', active: false },
    { icon: 'sell', label: 'Pricing', active: false },
    { icon: 'settings', label: 'Settings', active: false }
  ];

  categories = ['All', 'Sci-Fi', 'Fantasy', 'Drama', 'Business', 'Education', 'Geography'];
  selectedCategory = 'All';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Book[]>('http://localhost:3000/api/v1/books').subscribe({
      next: (books) => {
        console.log('Received books:', books);
        this.recommendedBooks = books.slice(0, 5);
        this.featuredBook = books[0];
      },
      error: (error) => console.error('Error fetching books:', error)
    });
  }

  getAverageRating(book: Book): number {
    if (!book.reviews || book.reviews.length === 0) return 0;
    const sum = book.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / book.reviews.length;
  }

  getRatingStars(rating: number): string {
    const rounded = Math.round(rating * 2) / 2; // round to .5
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rounded)) {
        stars += '⭐'; // full star
      } else if (i - 0.5 === rounded) {
        stars += '⭐'; // half star (using full star for simplicity)
      } else {
        stars += '☆'; // empty star
      }
    }
    
    return stars;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
}