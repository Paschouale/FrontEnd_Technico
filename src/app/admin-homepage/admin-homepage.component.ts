// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-admin-homepage',
//   standalone: true,
//   imports: [CommonModule, RouterModule], // Add RouterModule here
//   templateUrl: './admin-homepage.component.html',
//   styleUrls: ['./admin-homepage.component.scss']
// })
// export class AdminHomepageComponent {
//   constructor(private router: Router) {}

//   navigateToCreateOwner(): void {
//     this.router.navigate(['/create-owner']);
//   }

//   logout() {
//     localStorage.removeItem('user');
//     this.router.navigate(['/login']);
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule here
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.scss']
})
export class AdminHomepageComponent {
  notifications: string[] = [];
  unreadNotifications: string[] = [];
  showNotifications = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load stored notifications from localStorage
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      this.notifications = JSON.parse(storedNotifications);
      this.unreadNotifications = this.notifications.slice();
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  addNotification(message: string): void {
    this.notifications.push(message);
    this.unreadNotifications.push(message);
    this.saveNotifications();
  }

  markAsRead(index: number): void {
    this.unreadNotifications.splice(index, 1);
    this.saveNotifications();
  }

  saveNotifications(): void {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  navigateToCreateOwner(): void {
    this.router.navigate(['/create-owner']);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('notifications');
    this.router.navigate(['/login']);
  }
}
