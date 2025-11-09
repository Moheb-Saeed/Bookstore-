import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../services/cart.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private baseUrl = `${this.apiUrl}/users/favourite`;
  private _favorites = new BehaviorSubject<Book[]>([]);
  favorites$ = this._favorites.asObservable();

  constructor(private http: HttpClient) {}

  favourite = signal<any[]>([]);

  /** Load favorites from backend */
  loadFavorites() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http.get<any>(`${this.baseUrl}`, { headers }).subscribe({
      next: (res: any) => {
        this.favourite.set(res.favouriteBooks || []);
        console.log(this.favourite());
      },
    });
    return this.http.get<any>(`${this.baseUrl}`, { headers });
  }

  add(bookId: string) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http.post<any>(`${this.baseUrl}/${bookId}`, {}, { headers }).subscribe({
      next: (data) => {
        console.log(data);
        this.loadFavorites();
      },
      error: (err) => console.error('Failed to add favorite', err),
    });
  }

  /** Remove book from favorites */
  remove(bookId: string) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http.delete<any>(`${this.baseUrl}/${bookId}`, { headers }).subscribe({
      next: (response) => {
        this.loadFavorites()
        console.log('Remove favorite response:', response);
        // Update the BehaviorSubject if needed
        const updated = response.favouriteBook || response.data || response;
        if (Array.isArray(updated)) {
          this._favorites.next(updated);
        }
      },
      error: (err) => console.error('Failed to remove favorite', err),
    });
  }

  /** Check if a book is in favorites */
  isFavorite(bookId: string): boolean {
    return this._favorites.value.some((b) => b._id === bookId);
  }
}
