// src/app/pages/owner-homepage/owner-homepage.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Repair } from '../shared/model/repair';
import { Property } from '../shared/model/property';
import { RepairService } from '../shared/services/repair.service';
import { PropertyService } from '../shared/services/property.service';
import { PropertyOwnerService } from '../shared/services/property-owner.service';
import { Router } from '@angular/router';
import { RepairType } from '../shared/enumeration/repair-type';
import { RepairStatus } from '../shared/enumeration/repair-status';


@Component({
  selector: 'app-owner-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner-homepage.component.html',
  styleUrls: ['./owner-homepage.component.scss']
})
export class OwnerHomepageComponent implements OnInit {
  repairs: Repair[] = [];
  properties: Property[] = [];
  username: string | null = null;

  showModal: boolean = false;
  selectedRepair: Repair | null = null;
  updateMessage: string = '';

  // Create Repair Modal Properties
  createRepairModalVisible: boolean = false;
  selectedProperty: Property | null = null;
  createRepairForm: {
    repairType: RepairType | '';
    description: string;
  } = {
    repairType: '',
    description: ''
  };

  // Define available repair types (Assuming these are similar to admin's repair types)
  repairTypes: RepairType[] = [
    RepairType.GeneralMaintenance,
    RepairType.ELECTRICAL,
    RepairType.PLUMBING,
    RepairType.INSULATION,
    RepairType.PAINTING,
    RepairType.FRAMES
    // Add other RepairType enum values as needed
  ];

  constructor(
    private repairService: RepairService,
    private propertyService: PropertyService,
    private propertyOwnerService: PropertyOwnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.username = user.username;
      const ownerId = user.propertyOwnerId;
      if (ownerId) {
        // Fetch Repairs
        this.repairService.getRepairsByPropertyOwnerId(ownerId).subscribe((result: Repair[]) => {
          this.repairs = result;
        });

        // Fetch Property Owner to get VAT Number
        this.propertyOwnerService.getPropertyOwnerById(ownerId).subscribe({
          next: (owner) => {
            const vatNumber = owner.vatNumber;
            if (vatNumber) {
              // Fetch Properties using VAT Number
              this.propertyService.getPropertiesByOwnerVat(vatNumber).subscribe({
                next: (props: Property[]) => {
                  this.properties = props;
                },
                error: (err) => {
                  console.error('Failed to fetch properties:', err);
                  alert('Failed to load your properties. Please try again later.');
                }
              });
            } else {
              console.error('VAT Number not found for owner ID:', ownerId);
              alert('Your VAT Number is missing. Please contact support.');
            }
          },
          error: (err) => {
            console.error('Failed to fetch property owner details:', err);
            alert('Failed to load your details. Please try again later.');
          }
        });
      }
    }
  }

  requestUpdate(repair: Repair) {
    this.selectedRepair = repair;
    this.updateMessage = '';
    this.showModal = true;
  }

  sendUpdateRequest() {
    if (this.selectedRepair && this.updateMessage.trim()) {
      // Call the service method to send the request
      this.repairService
        .sendStatusUpdateRequest(this.selectedRepair.id, this.updateMessage)
        .subscribe({
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

  closeModal() {
    this.showModal = false;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  /**
   * Opens the Create Repair modal for the specified property.
   * @param property The property for which to create a repair.
   */
  openCreateRepairModal(property: Property): void {
    this.selectedProperty = property;
    this.createRepairForm = {
      repairType: '',
      description: ''
    };
    this.createRepairModalVisible = true;
  }

  /**
   * Closes the Create Repair modal.
   */
  closeCreateRepairModal(): void {
    this.createRepairModalVisible = false;
    this.selectedProperty = null;
    this.createRepairForm = {
      repairType: '',
      description: ''
    };
  }

  /**
   * Submits the Create Repair form.
   * Creates a repair with cost=0 and status="STANDBY".
   */
  submitCreateRepair(): void {
    if (!this.selectedProperty) {
      alert('No property selected.');
      return;
    }

    if (!this.createRepairForm.repairType || !this.createRepairForm.description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    // Define the new repair object with predefined cost and status
    const newRepair: Partial<Repair> = {
      repairType: this.createRepairForm.repairType,
      repairStatus: RepairStatus.STANDBY, // Set status to "STANDBY"
      cost: 0, // Set cost to 0
      description: this.createRepairForm.description.trim(),
      property: this.selectedProperty // Associate with the selected property
    };

    // Proceed to create the repair
    this.repairService.createRepair(newRepair).subscribe({
      next: (createdRepair: Repair) => {
        alert('Repair created successfully with status "STANDBY" and cost 0.');
        // Optionally, add the new repair to the repairs list
        this.repairs.push(createdRepair);
        // Close the modal
        this.closeCreateRepairModal();
      },
      error: (err) => {
        console.error('Failed to create repair:', err);
        alert('Failed to create repair. Please try again.');
      }
    });
  }
}
