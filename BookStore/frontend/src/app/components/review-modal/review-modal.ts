import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-modal.html',
})
export class ReviewModalComponent {
  @Input() isOpen = false;
  @Input() bookId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() reviewSubmitted = new EventEmitter<void>();

  reviewData = {
    userName: '',
    rating: 0,
    title: '',
    comment: '',
  };

  submitted = false;

  constructor(private reviewService: ReviewService) {}

  setRating(rating: number): void {
    this.reviewData.rating = rating;
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  submitReview(): void {
    this.submitted = true;

    if (
      !this.reviewData.userName ||
      this.reviewData.rating === 0 ||
      !this.reviewData.title ||
      !this.reviewData.comment
    ) {
      return;
    }

    this.reviewService.addReview({
      bookId: this.bookId,
      userName: this.reviewData.userName,
      userInitials: this.reviewService.getInitials(this.reviewData.userName),
      rating: this.reviewData.rating,
      title: this.reviewData.title,
      comment: this.reviewData.comment,
    });

    this.reviewSubmitted.emit();
    this.closeModal();
  }

  resetForm(): void {
    this.reviewData = {
      userName: '',
      rating: 0,
      title: '',
      comment: '',
    };
    this.submitted = false;
  }
}
