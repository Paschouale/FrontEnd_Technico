import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Repair } from '../shared/model/repair';
import { Property } from '../shared/model/property';
import { PropertyOwner } from '../shared/model/property-owner';
import { RepairService } from '../shared/services/repair.service';
import { PropertyService } from '../shared/services/property.service';
import { PropertyOwnerService } from '../shared/services/property-owner.service';

@Component({
  selector: 'app-admin-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.scss'],
})
export class AdminHomepageComponent implements OnInit {
  notifications: string[] = [];
  unreadNotifications: string[] = [];
  showNotifications = false;

  // Search-related properties
  searchTerm: string = '';
  private searchSubject: Subject<string> = new Subject<string>();

  // Data storage
  allRepairs: Repair[] = [];
  allProperties: Property[] = [];
  allPropertyOwners: PropertyOwner[] = [];

  // Filtered data
  filteredRepairs: Repair[] = [];
  filteredProperties: Property[] = [];
  filteredPropertyOwners: PropertyOwner[] = [];

  constructor(
    private router: Router,
    private repairService: RepairService,
    private propertyService: PropertyService,
    private propertyOwnerService: PropertyOwnerService
  ) {}

  ngOnInit(): void {
    // Fetch all Repairs
    this.repairService.getAllRepairs().subscribe({
      next: (repairs: Repair[]) => {
        this.allRepairs = repairs;
      },
      error: (err) => {
        console.error('Error fetching repairs:', err);
        alert('Failed to load repairs.');
      },
    });

    // Fetch all Properties
    this.propertyService.getAllProperties().subscribe({
      next: (properties: Property[]) => {
        this.allProperties = properties;
      },
      error: (err) => {
        console.error('Error fetching properties:', err);
        alert('Failed to load properties.');
      },
    });

    // Fetch all Property Owners
    this.propertyOwnerService.getAllPropertyOwners().subscribe({
      next: (owners: PropertyOwner[]) => {
        this.allPropertyOwners = owners;
      },
      error: (err) => {
        console.error('Error fetching property owners:', err);
        alert('Failed to load property owners.');
      },
    });

    // Setup search with debouncing
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      this.performSearch(term);
    });
  }

  // Existing navigation and logout methods
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

  // Search methods
  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(term: string): void {
    const lowerTerm = term.toLowerCase();

    // Filter Repairs
    this.filteredRepairs = this.allRepairs.filter((repair) =>
      repair.id.toString().includes(lowerTerm) ||
      repair.repairType.toLowerCase().includes(lowerTerm) ||
      repair.repairStatus.toLowerCase().includes(lowerTerm) ||
      repair.description.toLowerCase().includes(lowerTerm) ||
      repair.property.id.toString().includes(lowerTerm) ||
      repair.cost.toString().includes(lowerTerm)
    );

    // Filter Properties
    this.filteredProperties = this.allProperties.filter((property) =>
      property.id.toString().includes(lowerTerm) ||
      property.numberE9.toLowerCase().includes(lowerTerm) ||
      property.address.toLowerCase().includes(lowerTerm) ||
      property.propertyType.toLowerCase().includes(lowerTerm) ||
      property.yearOfConstruction.toString().includes(lowerTerm)
    );

    // Filter Property Owners
    this.filteredPropertyOwners = this.allPropertyOwners.filter((owner) =>
      owner.id.toString().includes(lowerTerm) ||
      owner.name.toLowerCase().includes(lowerTerm) ||
      owner.surname.toLowerCase().includes(lowerTerm) ||
      owner.vatNumber.toLowerCase().includes(lowerTerm) ||
      owner.phoneNumber.toLowerCase().includes(lowerTerm) ||
      owner.email.toLowerCase().includes(lowerTerm)
    );
  }
}
