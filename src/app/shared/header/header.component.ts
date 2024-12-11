// src/app/shared/header/header.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserService } from '../services/user.service';
import { PropertyOwnerService } from '../services/property-owner.service';
import { PropertyOwner } from '../model/property-owner';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  role: 'ADMIN' | 'PROPERTY_OWNER' | null = null;
  firstName: string = '';
  lastName: string = '';
  userName: string = ''; // For Admins, if applicable
  userSubscription!: Subscription;
  ownerSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private propertyOwnerService: PropertyOwnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe((user: User | null) => {
      this.role = user?.role || null;

      // Reset user information when user changes
      this.firstName = '';
      this.lastName = '';
      this.userName = '';

      if (this.role === 'PROPERTY_OWNER' && user?.propertyOwnerId) {
        // Fetch Property Owner details
        this.ownerSubscription = this.propertyOwnerService.getPropertyOwnerById(user.propertyOwnerId)
          .subscribe({
            next: (owner: PropertyOwner) => {
              this.firstName = owner.name;
              this.lastName = owner.surname;
            },
            error: (err) => {
              console.error('Failed to fetch property owner details:', err);
            }
          });
      } else if (this.role === 'ADMIN') {
        // Optionally, fetch Admin's name if available
        this.userName = user?.username || '';
      }
    });
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.ownerSubscription) {
      this.ownerSubscription.unsubscribe();
    }
  }
}
