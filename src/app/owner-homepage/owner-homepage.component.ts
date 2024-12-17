import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Repair } from '../shared/model/repair';
import { Property } from '../shared/model/property';
import { RepairService } from '../shared/services/repair.service';
import { PropertyService } from '../shared/services/property.service';
import { PropertyOwnerService } from '../shared/services/property-owner.service';
import { Router } from '@angular/router';
import { RepairType } from '../shared/enumeration/repair-type';
import { RepairStatus } from '../shared/enumeration/repair-status';
import { PropertyOwner } from '../shared/model/property-owner';
import { Role } from '../shared/enumeration/role';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-owner-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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

  // Fields for the edit-owner functionality
  ownerForm!: FormGroup;
  ownerId!: number;
  owner!: PropertyOwner;
  editMode: boolean = false; // toggle to show/hide the edit form

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
      this.ownerId = user.propertyOwnerId;

      if (this.ownerId) {
        // Fetch Repairs
        this.repairService.getRepairsByPropertyOwnerId(this.ownerId).subscribe((result: Repair[]) => {
          this.repairs = result;
        });

        // Fetch Property Owner details
        this.propertyOwnerService.getPropertyOwnerById(this.ownerId).subscribe({
          next: (owner) => {
            this.owner = owner;

            const vatNumber = owner.vatNumber;
            if (vatNumber) {
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
              console.error('VAT Number not found for owner ID:', this.ownerId);
              alert('Your VAT Number is missing. Please contact support.');
            }

            // Initialize form with the same structure as edit-owner
            this.ownerForm = new FormGroup({
              vatNumber: new FormControl(owner.vatNumber || '', [Validators.required, Validators.pattern("\\d{9}")]),
              name: new FormControl(owner.name || '', Validators.required),
              surname: new FormControl(owner.surname || '', Validators.required),
              address: new FormControl(owner.address || ''),
              phoneNumber: new FormControl(owner.phoneNumber || '', Validators.pattern("^[26]\\d{9}$")),
              email: new FormControl(owner.email || '', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
              username: new FormControl(owner.loginUser?.username || '', Validators.minLength(5)),
              password: new FormControl('', Validators.minLength(4))
            });
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

  closeModal() {
    this.showModal = false;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  openCreateRepairModal(property: Property): void {
    this.selectedProperty = property;
    this.createRepairForm = {
      repairType: '',
      description: ''
    };
    this.createRepairModalVisible = true;
  }

  closeCreateRepairModal(): void {
    this.createRepairModalVisible = false;
    this.selectedProperty = null;
    this.createRepairForm = {
      repairType: '',
      description: ''
    };
  }

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

  // Toggle edit mode
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  // Update the owner using the service (same logic as edit-owner)
 onSubmit() {
    if (this.ownerForm.valid) {
      const updatedOwner: PropertyOwner = {
        ...this.ownerForm.value,
        id: this.ownerId,
        loginUser: {
          username: this.ownerForm.get('username')?.value,
          password: this.ownerForm.get('password')?.value,
          role: 'PROPERTY_OWNER'
        }
      };

      this.propertyOwnerService.updatePropertyOwnerById(this.ownerId, updatedOwner)
      .pipe(catchError((err) => {
        console.log(err);
        alert(err.error);
        return EMPTY
      }))
        .subscribe(() => {
          alert('Property Owner updated successfully!');
          // Update local owner object
          this.owner = updatedOwner;
          this.editMode = false;
        });
    } else {
      alert('Please fill in all required fields correctly before submitting.');
    }
  }

  cancelEdit() {
    this.editMode = false;
    // Reset form to the owner's original data
    this.ownerForm.setValue({
      vatNumber: this.owner.vatNumber || '',
      name: this.owner.name || '',
      surname: this.owner.surname || '',
      address: this.owner.address || '',
      phoneNumber: this.owner.phoneNumber || '',
      email: this.owner.email || '',
      username: this.owner.loginUser?.username || '',
      password: ''
    });
  }
}
