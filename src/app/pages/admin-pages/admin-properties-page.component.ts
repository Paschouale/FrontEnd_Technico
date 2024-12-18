// src/app/pages/admin-pages/admin-properties-page.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // Ensure ngx-pagination is installed
import { PropertyService } from '../../shared/services/property.service';
import { Property } from '../../shared/model/property';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal

type SortableColumn = 'id' | 'numberE9' | 'propertyOwner' | 'propertyType' | 'address' | 'yearOfConstruction';

@Component({
  selector: 'app-admin-properties-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './admin-properties-page.component.html',
  styleUrls: ['./admin-properties-page.component.scss'],
})
export class AdminPropertiesPageComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = []; // Holds filtered results
  isLoading: boolean = false; // Indicates if data is loading
  searchTerm: string = ''; // Search input
  p: number = 1; // Current page number
  itemsPerPage: number = 10; // Items per page

  // Sorting variables
  sortColumn: SortableColumn | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Modal Templates
  @ViewChild('successModal') successModal!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;

  // Property to be deleted
  propertyToDelete!: Property | null;

  constructor(
    private propertyService: PropertyService,
    private router: Router,
    private modalService: NgbModal // Inject NgbModal
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties() {
    this.isLoading = true;
    this.propertyService.getAllProperties().subscribe({
      next: (props: Property[]) => {
        this.properties = props;
        this.filteredProperties = props;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching properties:', err);
        // Open Error Modal
        this.modalService.open(this.errorModal);
        this.isLoading = false;
      },
    });
  }

  navigateToCreateProperty() {
    this.router.navigate(['/create-property']);
  }

  updateProperty(property: Property) {
    this.router.navigate(['/edit-property', property.id]);
  }

  // New Method: Open Delete Confirmation Modal
  openDeleteModal(property: Property) {
    this.propertyToDelete = property;
    this.modalService.open(this.confirmDeleteModal, { ariaLabelledBy: 'confirm-delete-modal-title' });
  }

  // New Method: Confirm Deletion
  confirmDelete(modal: any) {
    if (this.propertyToDelete) {
      this.propertyService.deletePropertyByPropertyIdNumber(this.propertyToDelete.id).subscribe({
        next: () => {
          this.loadProperties();
          modal.close();
          // Open Success Modal
          this.modalService.open(this.successModal);
        },
        error: (err: any) => {
          console.error('Error deleting property:', err);
          modal.dismiss();
          // Open Error Modal
          this.modalService.open(this.errorModal);
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
      this.filteredProperties = this.properties;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProperties = this.properties.filter(prop =>
        prop.numberE9.toLowerCase().includes(term) ||
        prop.address.toLowerCase().includes(term) ||
        prop.propertyOwner.name.toLowerCase().includes(term) ||
        prop.propertyOwner.surname.toLowerCase().includes(term) ||
        prop.propertyType.toLowerCase().includes(term) ||
        prop.yearOfConstruction.toString().includes(term)
      );
    }
    this.p = 1; // Reset to first page after search
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredProperties = this.properties;
    this.p = 1; // Reset to first page
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

    this.filteredProperties.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (column) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'numberE9':
          aValue = a.numberE9.toLowerCase();
          bValue = b.numberE9.toLowerCase();
          break;
        case 'propertyOwner':
          aValue = `${a.propertyOwner.name} ${a.propertyOwner.surname}`.toLowerCase();
          bValue = `${b.propertyOwner.name} ${b.propertyOwner.surname}`.toLowerCase();
          break;
        case 'propertyType':
          aValue = a.propertyType.toLowerCase();
          bValue = b.propertyType.toLowerCase();
          break;
        case 'address':
          aValue = a.address.toLowerCase();
          bValue = b.address.toLowerCase();
          break;
        case 'yearOfConstruction':
          aValue = a.yearOfConstruction;
          bValue = b.yearOfConstruction;
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
