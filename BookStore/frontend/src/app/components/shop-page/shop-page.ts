import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Filter, FilterCriteria } from './filter/filter';
import { BookService } from '../../services/book.service';
import { CartService, Book } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorite.service';
import { Card } from './card/card';

export type { Book };

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule, Filter, HttpClientModule, Card],
  providers: [BookService],
  templateUrl: './shop-page.html',
})
export class ShopPage implements OnInit {
  currentFilter: FilterCriteria = {
    searchQuery: '',
    category: '',
    minPrice: null,
    maxPrice: null,
  };

  books: Book[] = [];
  filteredBooks: Book[] = [];
  favoritesCount: number = 0;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.favoritesService.loadFavorites();
    this.favoritesCount = this.favoritesService.favourite().length;

    this.updateBookFavoriteStatus(this.favoritesService.favourite());
    // Subscribe to favorites changes for real-time counter update
    this.favoritesService.favorites$.subscribe((favorites) => {
      this.favoritesCount = favorites.length;
      this.updateBookFavoriteStatus(favorites);
    });
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        console.log('Loaded books:', data);
        this.books = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading books:', error);
      },
    });
  }

  loadFavorites(): void {
    this.favoritesService.loadFavorites();
  }

  updateBookFavoriteStatus(favorites: Book[]): void {
    const favoriteIds = favorites.map((fav) => fav._id);
    this.books = this.books.map((book) => ({
      ...book,
      isFavorite: favoriteIds.includes(book._id),
    }));
    this.applyFilters();
  }

  onFilterChange(filterCriteria: FilterCriteria): void {
    this.currentFilter = filterCriteria;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.books];

    if (this.currentFilter.searchQuery && this.currentFilter.searchQuery.trim() !== '') {
      const query = this.currentFilter.searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
      );
    }

    if (
      this.currentFilter.category &&
      this.currentFilter.category !== '' &&
      this.currentFilter.category !== 'All'
    ) {
      result = result.filter((book) => book.genre === this.currentFilter.category);
    }

    if (this.currentFilter.minPrice !== null) {
      result = result.filter((book) => book.price >= this.currentFilter.minPrice!);
    }

    if (this.currentFilter.maxPrice !== null) {
      result = result.filter((book) => book.price <= this.currentFilter.maxPrice!);
    }

    this.filteredBooks = result;
    console.log('Filtered books:', this.filteredBooks.length);
  }

  onAddToCart(book: Book): void {
    this.cartService.addToCart(book._id);
    console.log('Added to cart:', book._id);
  }

  onToggleFavorite(book: Book): void {
    // The favorite toggle is now handled in the card component
    // This method just updates the local state
    const bookToUpdate = this.books.find((b) => b._id === book._id);
    if (bookToUpdate) {
      bookToUpdate.isFavorite = book.isFavorite;
    }
    this.applyFilters();
  }
}
