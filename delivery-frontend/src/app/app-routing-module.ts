import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Home } from './components/home/home';
import { Menu } from './components/menu/menu';
import { CartComponent } from './components/cart/cart';
import { LocationComponent } from './components/location/location';
import { OrdersComponent } from './components/orders/orders';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { NotFound } from './components/not-found/not-found';
import { AdminProducts } from './components/admin/admin-products/admin-products';
import { AdminOffers } from './components/admin/admin-offers/admin-offers';
import { AdminSales } from './components/admin/admin-sales/admin-sales';
import { AdminComplaints } from './components/admin/admin-complaints/admin-complaints';
import { AboutComponent } from './components/about/about';
import { ProfileComponent } from './components/profile/profile';
import { adminGuard } from './core/guards/admin-guard';
import { clientGuard } from './core/guards/client-guard';
import { authGuard } from './core/guards/auth-guard';
import { AdminCombos } from './components/admin/admin-combos/admin-combos';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'products', component: AdminProducts },
      { path: 'offers', component: AdminOffers },
      { path: 'orders', component: AdminSales },
      { path: 'complaints', component: AdminComplaints },
      { path: 'combos', component: AdminCombos },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [clientGuard],
    children: [
      { path: '', component: Home },
      { path: 'menu', component: Menu },
      { path: 'about', component: AboutComponent },
      { path: 'cart', component: CartComponent, canActivate: [authGuard] },
      { path: 'location', component: LocationComponent, canActivate: [authGuard] },
      { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) }
    ]
  },
  { path: '**', component: NotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }