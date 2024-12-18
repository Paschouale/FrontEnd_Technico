// src/app/owner-homepage/owner-homepage.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Repair } from '../shared/model/repair';
import { Property } from '../shared/model/property';
import { RepairService } from '../shared/services/repair.service';
import { PropertyService } from '../shared/services/property.service';
import { PropertyOwnerService } from '../shared/services/property-owner.service';
import { Router } from '@angular/router';
import { RepairType } from '../shared/enumeration/repair-type';
import { RepairStatus } from '../shared/enumeration/repair-status';
import { PropertyOwner } from '../shared/model/property-owner';
import { EMPTY, catchError, Subscription } from 'rxjs';

@Component({
  selector: 'app-owner-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './owner-homepage.component.html',
  styleUrls: ['./owner-homepage.component.scss']
})
export class OwnerHomepageComponent implements OnInit, OnDestroy {
  repairs: Repair[] = [];
  properties: Property[] = [];
  username: string | null = null;

  showModal: boolean = false;
  selectedRepair: Repair | null = null;
  updateMessage: string = '';

  createRepairModalVisible: boolean = false;
  selectedProperty: Property | null = null;
  createRepairForm: {
    repairType: RepairType | '';
    description: string;
  } = {
      repairType: '',
      description: ''
    };
  repairTypes: RepairType[] = [
    RepairType.ELECTRICAL,
    RepairType.PLUMBING,
    RepairType.INSULATION,
    RepairType.PAINTING,
    RepairType.FRAMES
  ];

  // Subscription variables removed

  constructor(
    private repairService: RepairService,
    private propertyService: PropertyService,
    private propertyOwnerService: PropertyOwnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.username = user.username;
      const ownerId = user.propertyOwnerId;

      if (ownerId) {
        this.propertyOwnerService.getPropertyOwnerById(ownerId).subscribe({
          next: (owner) => {
            const vatNumber = owner?.vatNumber;
            if (vatNumber) {
              this.propertyService.getPropertiesByOwnerVat(vatNumber).subscribe({
                next: (props: Property[]) => {
                  this.properties = props || [];
                },
                error: (err) => {
                  console.error('Failed to fetch properties:', err);
                  this.properties = [];
                }
              });
            } else {
              console.error('VAT Number not found for owner ID:', ownerId);
              this.properties = [];
            }
          },
          error: (err) => {
            console.error('Failed to fetch property owner details:', err);
            this.properties = [];
          }
        });

        this.repairService.getRepairsByPropertyOwnerId(ownerId).subscribe({
          next: (result: Repair[]) => {
            this.repairs = result || [];
          },
          error: (err) => {
            console.error('Failed to fetch repairs:', err);
            this.repairs = [];
          }
        });
      }
    }
  }


  // **Method to Logout**
  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // **Method to Open Create Repair Modal**
  openCreateRepairModal(property: Property): void {
    this.selectedProperty = property;
    this.createRepairForm = {
      repairType: '',
      description: ''
    };
    this.createRepairModalVisible = true;
  }

  // **Method to Close Create Repair Modal**
  closeCreateRepairModal(): void {
    this.createRepairModalVisible = false;
    this.selectedProperty = null;
    this.createRepairForm = {
      repairType: '',
      description: ''
    };
  }

  // **Method to Request Repair Status Update**
  requestUpdate(repair: Repair): void {
    this.selectedRepair = repair;
    this.updateMessage = '';
    this.showModal = true;
  }

  // **Method to Send Update Request**
  sendUpdateRequest(): void {
    if (this.selectedRepair && this.updateMessage.trim()) {
      this.repairService.sendStatusUpdateRequest(this.selectedRepair.id, this.updateMessage).subscribe({
        next: () => {
          alert('Your update request has been sent successfully.');
          this.showModal = false;
        },
        error: (err) => {
          console.error(err);
          alert('Failed to send update request.');
        },
      });
    } else {
      alert('Please enter a message before sending the request.');
    }
  }

  // **Method to Close Update Modal**
  closeModal(): void {
    this.showModal = false;
  }

  // **Method to Submit Create Repair Form**
  submitCreateRepair(): void {
    if (!this.selectedProperty) {
      alert('No property selected.');
      return;
    }

    if (!this.createRepairForm.repairType || !this.createRepairForm.description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    const newRepair: Partial<Repair> = {
      repairType: this.createRepairForm.repairType,
      repairStatus: RepairStatus.STANDBY,
      cost: 0,
      description: this.createRepairForm.description.trim(),
      property: this.selectedProperty
    };

    this.repairService.createRepair(newRepair).subscribe({
      next: (createdRepair: Repair) => {
        alert('Repair created successfully with status "STANDBY" and cost 0.');
        this.repairs.push(createdRepair);
        this.closeCreateRepairModal();
      },
      error: (err) => {
        console.error('Failed to create repair:', err);
        alert('Failed to create repair. Please try again.');
      }
    });
  }

  ngOnDestroy(): void {
    // No subscriptions to clean up
  }

  // Method to get badge color based on repair status
  getStatusBadge(status: string): string {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'success';
      case 'inprogress':
        return 'warning';
      case 'pending':
        return 'secondary';
      default:
        return 'primary';
    }
  }



}

