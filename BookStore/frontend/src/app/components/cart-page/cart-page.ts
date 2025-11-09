import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';
import { CartService } from '../../services/cart.service';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CheckoutDetails {
  receiverName: string;
  billingAddress: string;
  sendingAddress: string;
  province: string;
  contactNumber: string;
  cardNumber: string;
}

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage implements OnInit {
  constructor(private cartService: CartService) {}
  private http = inject(HttpClient);

  cartItems = signal<Book[]>([]);

  private cartApiUrl = 'http://localhost:3000/api/v1/users/cart';

  showCheckoutModal = signal(false);
  notification = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  totalPrice = computed(() => {
    return this.cartItems()
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  });

  checkoutDetails = signal<CheckoutDetails>({
    receiverName: '',
    billingAddress: '',
    sendingAddress: '',
    province: '',
    contactNumber: '',
    cardNumber: '',
  });

  ngOnInit(): void {
    this.fetchCartItems();
  }

  fetchCartItems(): void {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    this.http.get<any>(this.cartApiUrl, { headers, responseType: 'json' as const }).subscribe({
      next: (resp) => {
        const cart = resp?.cart ?? [];
        const mapped: Book[] = cart.map((b: any) => ({
          id: b._id ?? b.id ?? '',
          title: b.title ?? b.name ?? 'Untitled',
          author: b.author ?? b.writer ?? '',
          price: typeof b.price === 'number' ? b.price : Number(b.price) || 0,
          imageUrl: b.bookCoverImage || '/assets/default-book.png',
          quantity: b.quantity ?? 1,
        }));

        this.cartItems.set(mapped);
      },
      error: (err) => {
        console.error('Failed to load cart items from backend:', err);
        this.cartItems.set([]);
      },
    });
  }

  updateQuantity(bookToUpdate: Book, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeBookFromCart(bookToUpdate);
      return;
    }

    if (newQuantity < 1) newQuantity = 1;

    this.cartItems.update((items) =>
      items.map((item) => (item === bookToUpdate ? { ...item, quantity: newQuantity } : item))
    );
  }

  removeBookFromCart(book: Book): void {
    this.cartItems.update((items) => items.filter((it) => it !== book));

    const id = book.id;

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const url = `${this.cartApiUrl}/${id}`;

    this.http.delete(url, { headers }).subscribe({
      next: () => {
        console.log(`Deleted cart item ${id} from server`);
        this.cartService.loadCart();
      },
      error: (err) => console.error(`Failed to delete cart item ${id}:`, err),
    });
  }

  onInputChange(field: keyof CheckoutDetails, value: string | number | null): void {
    this.checkoutDetails.update((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));
  }

  openCheckoutModal(): void {
    if (this.cartItems().length === 0) {
      alert('Your Cart is Empty');
      return;
    }

    this.showCheckoutModal.set(true);
    console.log('Proceed to Checkout clicked! Opening modal.');
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal.set(false);
    console.log('Closing checkout modal.');
    this.checkoutDetails.set({
      receiverName: '',
      billingAddress: '',
      sendingAddress: '',
      province: '',
      contactNumber: '',
      cardNumber: '',
    });
    this.notification.set(null);
  }

  async payNow(): Promise<void> {
    const details = this.checkoutDetails();
    const requiredFields: (keyof typeof details)[] = [
      'receiverName',
      'billingAddress',
      'sendingAddress',
      'province',
      'contactNumber',
      'cardNumber',
    ];

    const missing = requiredFields.filter((k) => !details[k] || String(details[k]).trim() === '');

    if (missing.length > 0) {
      this.notification.set({ type: 'error', text: 'All fields must be filled' });
      setTimeout(() => this.notification.set(null), 3000);
      return;
    }

    try {
      const products = this.cartItems().map((book) => ({
        title: book.title,
        price: book.price,
        quantity: book.quantity,
      }));

      const session = await this.http
        .post<{ url: string }>('http://localhost:3000/api/v1/stripe/create-checkout-session', {
          products,
        })
        .toPromise();

      if (session && session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      this.notification.set({
        type: 'error',
        text: error.message || 'Failed to start payment process. Please try again.',
      });
      setTimeout(() => this.notification.set(null), 4000);
    }
  }

  private async clearCartOnSuccess(): Promise<void> {
    const items = this.cartItems();
    if (!items || items.length === 0) return;

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const deletePromises = items
      .map((it) => it.id)
      .filter(Boolean)
      .map((id) => {
        const url = `${this.cartApiUrl}/${id}`;
        return lastValueFrom(this.http.delete(url, { headers }));
      });

    try {
      await Promise.all(deletePromises);
      this.cartItems.set([]);
      console.log('Cleared user cart after successful checkout.');
    } catch (err) {
      console.error(err);
    }
  }
}
