import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // Ensure ngx-pagination is installed
import { RepairService } from '../../shared/services/repair.service';
import { Repair } from '../../shared/model/repair';

type SortableColumn = 'id' | 'repairType' | 'repairStatus' | 'cost' | 'description' | 'propertyId';

@Component({
  selector: 'app-admin-repairs-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './admin-repairs-page.component.html',
  styleUrls: ['./admin-repairs-page.component.scss']
})
export class AdminRepairsPageComponent implements OnInit {
  repairs: Repair[] = [];
  filteredRepairs: Repair[] = []; // Holds filtered results
  isLoading: boolean = false; // Indicates if data is loading
  searchTerm: string = ''; // Search input
  p: number = 1; // Current page number
  itemsPerPage: number = 10; // Items per page

  // Sorting variables
  sortColumn: SortableColumn | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private repairService: RepairService, private router: Router) {}

  ngOnInit(): void {
    this.loadRepairs();
  }

  loadRepairs() {
    this.isLoading = true;
    this.repairService.getAllRepairs().subscribe({
      next: (reps: Repair[]) => {
        this.repairs = reps;
        this.filteredRepairs = reps;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching repairs:', err);
        alert('Failed to load repairs.');
        this.isLoading = false;
      },
    });
  }

  navigateToCreateRepair() {
    this.router.navigate(['/create-repair']);
  }

  updateRepair(repair: Repair) {
    this.router.navigate(['/edit-repair', repair.id]);
  }

  deleteRepair(repair: Repair) {
    if (confirm(`Are you sure you want to delete repair ID ${repair.id}?`)) {
      this.repairService.deleteRepairById(repair.id).subscribe({
        next: () => {
          this.loadRepairs();
          alert('Repair deleted successfully.');
        },
        error: (err: any) => {
          console.error('Error deleting repair:', err);
          alert('Failed to delete repair.');
        },
      });
    }
  }

  backToHome(){
    this.router.navigate(['/admin-home']);
  }

  // Search functionality
  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredRepairs = this.repairs;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredRepairs = this.repairs.filter(rep =>
        rep.repairType.toLowerCase().includes(term) ||
        rep.repairStatus.toLowerCase().includes(term) ||
        rep.description.toLowerCase().includes(term) ||
        rep.property.id.toString().includes(term) ||
        rep.cost.toString().includes(term) ||
        rep.id.toString().includes(term)
      );
    }
    this.p = 1; // Reset to first page after search
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredRepairs = this.repairs;
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

    this.filteredRepairs.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (column) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'repairType':
          aValue = a.repairType.toLowerCase();
          bValue = b.repairType.toLowerCase();
          break;
        case 'repairStatus':
          aValue = a.repairStatus.toLowerCase();
          bValue = b.repairStatus.toLowerCase();
          break;
        case 'cost':
          aValue = a.cost;
          bValue = b.cost;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'propertyId':
          aValue = a.property.id;
          bValue = b.property.id;
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
