import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userRole$.subscribe(role => {
      this.isLoggedIn = !!role;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}