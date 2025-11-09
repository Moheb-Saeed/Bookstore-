import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  userInitials: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviews = new BehaviorSubject<Review[]>([]);
  reviews$ = this.reviews.asObservable();

  constructor() {
    // Load from localStorage if available
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews);
      // Convert date strings back to Date objects
      parsedReviews.forEach((review: Review) => {
        review.date = new Date(review.date);
      });
      this.reviews.next(parsedReviews);
    }
  }

  addReview(review: Omit<Review, 'id' | 'date' | 'verified'>): void {
    const newReview: Review = {
      ...review,
      id: this.generateId(),
      date: new Date(),
      verified: true
    };

    const currentReviews = this.reviews.value;
    const updatedReviews = [newReview, ...currentReviews];
    this.reviews.next(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  }

  getReviewsByBookId(bookId: string): Review[] {
    return this.reviews.value.filter(review => review.bookId === bookId);
  }

  getAverageRating(bookId: string): number {
    const bookReviews = this.getReviewsByBookId(bookId);
    if (bookReviews.length === 0) return 0;

    const sum = bookReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / bookReviews.length) * 10) / 10;
  }

  getReviewCount(bookId: string): number {
    return this.getReviewsByBookId(bookId).length;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
