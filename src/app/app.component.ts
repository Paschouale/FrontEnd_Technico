// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet],
//   template: `<router-outlet></router-outlet>`,
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {}
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FrontEnd_Technico';
  role: 'ADMIN' | 'PROPERTY_OWNER' | null = null;
  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkUserRole();

    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  checkUserRole() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.role = user.role; // 'ADMIN' or 'PROPERTY_OWNER'
    } else {
      this.role = null;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.role = null;
    this.router.navigate(['/login']);
  }

  // Condition for showing nav:
  // Show nav if:
  // - Admin and currently on '/admin-home'
  // - Property Owner and currently on '/owner-home'
  get showNav(): boolean {
    if (this.role === 'ADMIN' && this.currentRoute === '/admin-home') return true;
    if (this.role === 'PROPERTY_OWNER' && this.currentRoute === '/owner-home') return true;
    return false;
  }
  
}
