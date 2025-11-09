import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../services/cart.service';
import { ReviewService, Review } from '../../services/review.service';
import { ReviewModalComponent } from '../review-modal/review-modal';

@Component({
  selector: 'app-book-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewModalComponent],
  providers: [BookService],
  templateUrl: './book-details-page.html',
})
export class BookDetailsPage implements OnInit {
  book?: Book;
  loading = true;
  error: string | null = null;

  isReviewModalOpen = false;

  userReviews: Review[] = [];
  averageRating: number = 0;
  totalReviews: number = 0;

  defaultReviews = [
    {
      userName: 'Jane Carter',
      userInitials: 'JC',
      rating: 5,
      title: 'Absolutely Captivating',
      comment:
        "This mystery kept me on the edge of my seat from start to finish. Emily Carter's writing is masterful, and the twist at the end was completely unexpected. Highly recommend!",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      verified: true,
      color: 'from-blue-400 to-blue-600',
    },
    {
      userName: 'Michael Davis',
      userInitials: 'MD',
      rating: 4,
      title: 'Great Read, Slightly Predictable',
      comment:
        'The Silent Observer is an engaging mystery with well-developed characters. While some plot points felt familiar, the atmospheric setting more than makes up for it. Worth picking up!',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      verified: true,
      color: 'from-purple-400 to-purple-600',
    },
    {
      userName: 'Sarah Rodriguez',
      userInitials: 'SR',
      rating: 5,
      title: 'Perfect Mystery Novel',
      comment:
        "I couldn't put this book down! The pacing is perfect, the dialogue feels natural, and the mystery elements are woven seamlessly throughout. A fantastic addition to any mystery lover's library.",
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      verified: true,
      color: 'from-green-400 to-green-600',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Invalid book ID';
      this.loading = false;
      return;
    }

    this.bookService.getBooks().subscribe({
      next: (books) => {
        const booksArray = Array.isArray(books) ? books : books['books'];
        this.book = booksArray.find((b) => b._id === id);

        if (!this.book) {
          this.error = 'Book not found';
        } else {
          this.loadReviews();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading book details:', err);
        this.error = 'Failed to load book details';
        this.loading = false;
      },
    });

    this.reviewService.reviews$.subscribe(() => {
      if (this.book) {
        this.loadReviews();
      }
    });
  }

  loadReviews(): void {
    console.log(this.book?.title);
    if (!this.book) return;

    this.userReviews = this.reviewService.getReviewsByBookId(this.book._id);
    this.totalReviews = this.userReviews.length + this.defaultReviews.length;

    const userRatingsSum = this.userReviews.reduce((sum, r) => sum + r.rating, 0);
    const defaultRatingsSum = this.defaultReviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = (userRatingsSum + defaultRatingsSum) / this.totalReviews;
  }

  openReviewModal(): void {
    this.isReviewModalOpen = true;
  }

  closeReviewModal(): void {
    this.isReviewModalOpen = false;
  }

  onReviewSubmitted(): void {
    this.loadReviews();
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  getRandomColor(): string {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-red-400 to-red-600',
      'from-yellow-400 to-yellow-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
