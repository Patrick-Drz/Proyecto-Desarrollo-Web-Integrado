import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
import { CartService } from '../../core/services/cart'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  userName = 'Estudiante';
  cartItemCount = 0; 

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cartService: CartService 
  ) {}

  ngOnInit(): void {
    this.authService.userRole$.subscribe(role => {
      this.isLoggedIn = !!role;
    });

    this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}