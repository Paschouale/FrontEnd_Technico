import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.scss'],
})
export class AdminHomepageComponent {
  notifications: string[] = [];
  unreadNotifications: string[] = [];
  showNotifications = false;

  constructor(private router: Router) {}

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(index: number): void {
    this.unreadNotifications.splice(index, 1);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  navigateToCreatePropertyOwner(): void {
    this.router.navigate(['/create-owner']);
  }

  navigateToCreateProperty(): void {
    this.router.navigate(['/create-property']);
  }

  navigateToCreateRepair(): void {
    this.router.navigate(['/create-repair']);
  }
}
