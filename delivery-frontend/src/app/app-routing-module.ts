import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Home } from './components/home/home';
import { Menu } from './components/menu/menu';
import { CartComponent } from './components/cart/cart';
import { NotFound } from './components/not-found/not-found';

const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'menu', component: Menu },
      { path: 'cart', component: CartComponent },
      { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) }
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: Home }, 
    ]
  },
  { path: '**', component: NotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }