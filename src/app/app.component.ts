
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs/operators';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent implements OnInit {
//   title = 'FrontEnd_Technico';
//   role: 'ADMIN' | 'PROPERTY_OWNER' | null = null;
//   currentRoute: string = '';

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     this.checkUserRole();

//     // Listen for route changes
//     this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd)
//     ).subscribe((event: any) => {
//       this.currentRoute = event.url;
//     });
//   }

//   checkUserRole() {
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       const user = JSON.parse(userStr);
//       this.role = user.role; // 'ADMIN' or 'PROPERTY_OWNER'
//     } else {
//       this.role = null;
//     }
//   }

//   logout() {
//     localStorage.removeItem('user');
//     this.role = null;
//     this.router.navigate(['/login']);
//   }

//   // get showNav(): boolean {
//   //   if (this.role === 'ADMIN' && this.currentRoute === '/admin-home') return true;
//   //   if (this.role === 'PROPERTY_OWNER' && this.currentRoute === '/owner-home') return true;
//   //   return false;
//   // }
//   get showNav(): boolean {
//     return !this.currentRoute.startsWith('/login');
//   }
// app.component.ts

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs/operators';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent implements OnInit {
//   title = 'FrontEnd_Technico';
//   role: 'ADMIN' | 'PROPERTY_OWNER' | null = null;
//   currentRoute: string = '';

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     this.checkUserRole();

//     // Listen for route changes
//     this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd)
//     ).subscribe((event: NavigationEnd) => {
//       this.currentRoute = event.urlAfterRedirects;
//     });
//   }

//   checkUserRole() {
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       const user = JSON.parse(userStr);
//       this.role = user.role; // 'ADMIN' or 'PROPERTY_OWNER'
//     } else {
//       this.role = null;
//     }
//   }

//   logout() {
//     localStorage.removeItem('user');
//     this.role = null;
//     this.router.navigate(['/login']);
//   }

//   get showNav(): boolean {
//     return !this.currentRoute.startsWith('/login');
//   }
// }
// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

// src/app/app.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService, User } from './shared/services/user.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from './shared/header/header.component';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterModule, // Add RouterModule to imports
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

    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
      this.updateShowNav();
    });

    // Subscribe to user state changes
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
