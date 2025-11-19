import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();

    this.router.navigate(['/auth/login']);
  }
}