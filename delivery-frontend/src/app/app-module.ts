import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './components/home/home';
import { Navbar } from './components/navbar/navbar';
import { NotFound } from './components/not-found/not-found';
import { Menu } from './components/menu/menu';
import { CartComponent } from './components/cart/cart';
import { LocationComponent } from './components/location/location';
import { OrdersComponent } from './components/orders/orders';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { AdminProducts } from './components/admin/admin-products/admin-products';
import { AdminOffers } from './components/admin/admin-offers/admin-offers';
import { AdminSales } from './components/admin/admin-sales/admin-sales';
import { AdminComplaints } from './components/admin/admin-complaints/admin-complaints';

@NgModule({
  declarations: [
    App,
    Home,
    Navbar,
    NotFound,
    Menu,
    CartComponent,
    LocationComponent,
    OrdersComponent,
    Dashboard,
    MainLayout,
    AdminLayout,
    AdminProducts,
    AdminOffers,
    AdminSales,
    AdminComplaints
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }