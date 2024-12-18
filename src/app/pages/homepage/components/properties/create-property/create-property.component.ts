// src/app/pages/homepage/components/property/create-property/create-property.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../../../shared/services/property.service';
import { PropertyOwnerService } from '../../../../../shared/services/property-owner.service';
import { Router } from '@angular/router';
import { PropertyType } from '../../../../../shared/enumeration/property-type';
import { CommonModule } from '@angular/common';
import { PropertyOwner } from '../../../../../shared/model/property-owner';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.scss']
})
export class CreatePropertyComponent implements OnInit {

  propertyForm!: FormGroup;
  propertyTypes = Object.values(PropertyType); // Populate property types
  propertyOwners: PropertyOwner[] = [];
  errorMessages: string[] = []; // Array to hold dynamic error messages

  @ViewChild('successModal') successModal!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;

  constructor(
    private propertyService: PropertyService,
    private propertyOwnerService: PropertyOwnerService,
    private router: Router,
    private modalService: NgbModal // Inject NgbModal
  ) { }

  ngOnInit(): void {
    // Fetch all property owners to populate the dropdown
    this.propertyOwnerService.getAllPropertyOwners().subscribe({
      next: (owners: PropertyOwner[]) => {
        this.propertyOwners = owners;
      },
      error: (err) => {
        console.error('Failed to fetch property owners:', err);
        // Open Error Modal instead of alert
        this.modalService.open(this.errorModal);
      }
    });

    // Initialize the form
    this.propertyForm = new FormGroup({
      numberE9: new FormControl('', [
        Validators.required,
        Validators.pattern("^\\d+$") // Pattern for exactly 5 digits
      ]),
      address: new FormControl(''),
      yearOfConstruction: new FormControl(''),
      propertyType: new FormControl('', Validators.required),
      propertyOwner: new FormGroup({
        id: new FormControl('', Validators.required)
      })
    });
  }

  // Method to format E9 Number input to allow only digits and limit to 5 digits
  formatNumberE9() {
    const control = this.propertyForm.get('numberE9');
    if (control) {
      let value: string = control.value;
      // Remove any non-digit characters
      value = value.replace(/\D/g, '');
      // Limit to 10 digits
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      control.setValue(value, { emitEvent: false });
    }
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      // Concatenate "E9-" with the numberE9 value
      const numberE9WithPrefix = `E9-${this.propertyForm.get('numberE9')?.value}`;

      const formValue = {
        ...this.propertyForm.value,
        numberE9: numberE9WithPrefix, // Update the numberE9 field with prefix
        propertyOwner: {
          id: this.propertyForm.get('propertyOwner.id')?.value
        }
      };

      this.propertyService.postProperty(formValue)
        .pipe(
          catchError((err) => {
            console.log(err);
            this.errorMessages = []; // Reset error messages

            // Extract error messages from the backend response
            if (err.error) {
              if (typeof err.error === 'string') {
                this.errorMessages.push(err.error);
              } else if (Array.isArray(err.error.errors)) {
                this.errorMessages = err.error.errors;
              } else if (err.error.message) {
                this.errorMessages.push(err.error.message);
              } else {
                this.errorMessages.push('An unknown error occurred.');
              }
            } else {
              this.errorMessages.push('An unknown error occurred.');
            }

            // Open Error Modal with the dynamic error messages
            this.modalService.open(this.errorModal, { ariaLabelledBy: 'error-modal-title' });
            return EMPTY;
          })
        )
        .subscribe(() => {
          // Open Success Modal instead of alert
          this.modalService.open(this.successModal);
          // Optionally, navigate after closing modal
          this.router.navigate(['/admin-properties']);
        });
    } else {
      // Open Error Modal if form is invalid instead of alert
      this.modalService.open(this.errorModal);
    }
  }

  // Added cancel() method
  cancel() {
    this.router.navigate(['/admin-properties']);
  }
}
