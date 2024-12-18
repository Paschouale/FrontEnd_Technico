// src/app/pages/admin-pages/admin-repairs-page.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RepairService } from '../../shared/services/repair.service';
import { Repair } from '../../shared/model/repair';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

type SortableColumn = 'id' | 'repairType' | 'repairStatus' | 'cost' | 'description' | 'propertyId';

@Component({
  selector: 'app-admin-repairs-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './admin-repairs-page.component.html',
  styleUrls: ['./admin-repairs-page.component.scss'],
})
export class AdminRepairsPageComponent implements OnInit {
  repairs: Repair[] = [];
  filteredRepairs: Repair[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  p: number = 1;
  itemsPerPage: number = 10;

  sortColumn: SortableColumn | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  repairToDelete!: Repair | null;

  @ViewChild('successModal') successModal!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;

  constructor(
    private repairService: RepairService,
    private router: Router,
    private modalService: NgbModal
  ) {}

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
        this.modalService.open(this.errorModal);
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

  openDeleteModal(repair: Repair) {
    this.repairToDelete = repair;
    this.modalService.open(this.confirmDeleteModal, { ariaLabelledBy: 'confirm-delete-modal-title' });
  }

  confirmDelete(modal: any) {
    if (this.repairToDelete) {
      this.repairService.deleteRepairById(this.repairToDelete.id).subscribe({
        next: () => {
          this.loadRepairs();
          modal.close();
          this.modalService.open(this.successModal);
        },
        error: (err: any) => {
          console.error('Error deleting repair:', err);
          modal.dismiss();
          this.modalService.open(this.errorModal);
        },
      });
    }
  }

  backToHome() {
    this.router.navigate(['/admin-home']);
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredRepairs = this.repairs;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredRepairs = this.repairs.filter((rep) =>
        rep.repairType.toLowerCase().includes(term) ||
        rep.repairStatus.toLowerCase().includes(term) ||
        rep.description.toLowerCase().includes(term) ||
        rep.property.id.toString().includes(term) ||
        rep.cost.toString().includes(term) ||
        rep.id.toString().includes(term)
      );
    }
    this.p = 1;
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredRepairs = this.repairs;
    this.p = 1;
  }

  sortTable(column: SortableColumn) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
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
      return 'bi bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }
}
