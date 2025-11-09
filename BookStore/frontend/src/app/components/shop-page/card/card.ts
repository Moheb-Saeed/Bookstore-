import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Book } from '../../../services/cart.service';
import { FavoritesService } from '../../../services/favorite.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card.html',
})
export class Card {
  @Input() book!: Book;
  @Output() addToCart = new EventEmitter<Book>();
  @Output() toggleFavorite = new EventEmitter<Book>();
  isLogin = localStorage['token'];

  constructor(private router: Router, private favoritesService: FavoritesService) {}

  onAddToCart(): void {
    console.log(this.book);
    this.addToCart.emit(this.book);
  }

  onToggleFavorite() {
    if (!this.book.isFavorite) {
      // Add to favorites
      this.favoritesService.add(this.book._id);
      this.book.isFavorite = true; // Toggle the state
      console.log('added to favorites');
    } else {
      // Remove from favorites
      this.favoritesService.remove(this.book._id);
      this.book.isFavorite = false; // Toggle the state
      console.log('removed from favorites');
    }
  }

  goToDetails(): void {
    this.router.navigate(['/books', this.book._id]);
  }
  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
