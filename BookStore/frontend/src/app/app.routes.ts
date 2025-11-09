import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { ShopPage } from './components/shop-page/shop-page';
import { BookDetailsPage } from './components/book-details-page/book-details-page';
import { CartPage } from './components/cart-page/cart-page';
import { AboutPage } from './components/about-page/about-page';
import { FavouriteBookPage } from './components/favourite-book-page/favourite-book-page';
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page';
import { DashboardComponent } from './components/dashboard/dashboard';
import { NotFound } from './components/not-found/not-found';
import { SuccessPage } from './components/success-page/success-page';
import { CancelPage } from './components/cancel-page/cancel-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomePage },
  { path: 'shop', component: ShopPage },
  { path: 'books/:id', component: BookDetailsPage },
  { path: 'cart', component: CartPage },
  { path: 'about', component: AboutPage },
  { path: 'favourite', component: FavouriteBookPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'success', component: SuccessPage },
  { path: 'cancel', component: CancelPage },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', component: NotFound },
];
