// src/app/app.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService, User } from './shared/services/user.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterModule, // Ensure RouterModule is imported for routing functionalities
    // Add other necessary imports here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'FrontEnd_Technico';
  role: 'ADMIN' | 'PROPERTY_OWNER' | null = null;
  currentRoute: string = '';
  userSubscription!: Subscription;

  // Variable to store Property Owner's username
  ownerUsername: string = '';

  // Flag to show/hide header and sidebar
  showNav: boolean = true;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.checkUserRole();

    // Listen for route changes to toggle navigation visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
      this.updateShowNav();
    });

    // Subscribe to user state changes to update role and username
    this.userSubscription = this.userService.user$.subscribe((user: User | null) => {
      this.role = user?.role || null;

      if (this.role === 'PROPERTY_OWNER' && user?.username) {
        // Assign the username directly
        this.ownerUsername = user.username;
      } else {
        this.ownerUsername = '';
      }
    });
  }

  checkUserRole() {
    const user = this.userService.getCurrentUser();
    this.role = user?.role || null;

    if (this.role === 'PROPERTY_OWNER' && user?.username) {
      this.ownerUsername = user.username;
    } else {
      this.ownerUsername = '';
    }
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

  // Update showNav based on current route
  updateShowNav() {
    if (this.currentRoute.startsWith('/login')) {
      this.showNav = false;
    } else {
      this.showNav = true;
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
