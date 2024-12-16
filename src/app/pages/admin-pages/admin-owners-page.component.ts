// src/app/pages/admin-pages/admin-owners-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // Ensure ngx-pagination is installed
import { PropertyOwnerService } from '../../shared/services/property-owner.service';
import { PropertyOwner } from '../../shared/model/property-owner';

type SortableColumn = 'id' | 'name' | 'surname' | 'vatNumber' | 'phoneNumber' | 'username';

@Component({
  selector: 'app-admin-owners-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './admin-owners-page.component.html',
  styleUrls: ['./admin-owners-page.component.scss'],
})
export class AdminOwnersPageComponent implements OnInit {
  propertyOwners: PropertyOwner[] = [];
  filteredPropertyOwners: PropertyOwner[] = []; // To hold filtered results
  isLoading: boolean = false; // For loading indicator
  searchTerm: string = ''; // For search input
  p: number = 1; // Current page number
  itemsPerPage: number = 10; // Number of items per page

  // Sorting variables
  sortColumn: SortableColumn | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private propertyOwnerService: PropertyOwnerService, private router: Router) {}

  ngOnInit(): void {
    this.loadOwners();
  }

  loadOwners() {
    this.isLoading = true;
    this.propertyOwnerService.getAllPropertyOwners().subscribe({
      next: (owners: PropertyOwner[]) => {
        this.turnOwnerPasswordsIntoAsterisks(owners);
        this.propertyOwners = owners;
        this.filteredPropertyOwners = owners;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching property owners:', err);
        alert('Failed to load property owners.');
        this.isLoading = false;
      },
    });
  }

  navigateToCreateOwner() {
    this.router.navigate(['/create-owner']);
  }

  updateOwner(owner: PropertyOwner) {
    this.router.navigate(['/edit-owner', owner.id]);
  }

  deletePropertyOwner(owner: PropertyOwner) {
    if (confirm(`Are you sure you want to delete property owner ID ${owner.id}?`)) {
      this.propertyOwnerService.deletePropertyOwnerById(owner.id).subscribe({
        next: () => {
          this.loadOwners();
          alert('Property owner deleted successfully.');
        },
        error: (err: any) => {
          console.error('Error deleting property owner:', err);
          alert('Failed to delete property owner.');
        },
      });
    }
  }

  backToHome() {
    this.router.navigate(['/admin-home']);
  }

  // Search functionality
  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredPropertyOwners = this.propertyOwners;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredPropertyOwners = this.propertyOwners.filter(owner =>
        owner.name.toLowerCase().includes(term) ||
        owner.surname.toLowerCase().includes(term) ||
        owner.vatNumber.toLowerCase().includes(term) ||
        owner.phoneNumber.toLowerCase().includes(term) ||
        owner.loginUser.username.toLowerCase().includes(term)
      );
    }
    this.p = 1; // Reset to first page after search
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredPropertyOwners = this.propertyOwners;
    this.p = 1; // Reset to first page
  }

  // Password masking
  private turnOwnerPasswordsIntoAsterisks(owners: PropertyOwner[]) {
    owners.forEach((owner) => {
      owner.loginUser.password = '****';
    });
  }

  // Sorting functionality
  sortTable(column: SortableColumn) {
    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set to ascending for new column
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredPropertyOwners.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (column) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'surname':
          aValue = a.surname.toLowerCase();
          bValue = b.surname.toLowerCase();
          break;
        case 'vatNumber':
          aValue = a.vatNumber.toLowerCase();
          bValue = b.vatNumber.toLowerCase();
          break;
        case 'phoneNumber':
          aValue = a.phoneNumber.toLowerCase();
          bValue = b.phoneNumber.toLowerCase();
          break;
        case 'username':
          aValue = a.loginUser.username.toLowerCase();
          bValue = b.loginUser.username.toLowerCase();
          break;
        default:
          aValue = '';
          bValue = '';
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(column: SortableColumn): string {
    if (this.sortColumn !== column) {
      return 'bi bi-arrow-down-up'; // Default sort icon
    }
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }
}
