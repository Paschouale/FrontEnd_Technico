import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../../../shared/services/property.service';
import { PropertyOwnerService } from '../../../../../shared/services/property-owner.service';
import { Router } from '@angular/router';
import { PropertyType } from '../../../../../shared/enumeration/property-type';
import { CommonModule } from '@angular/common';
import { PropertyOwner } from '../../../../../shared/model/property-owner';
import { EMPTY, catchError } from 'rxjs';

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

  constructor(
    private propertyService: PropertyService,
    private propertyOwnerService: PropertyOwnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Fetch all property owners to populate the dropdown
    this.propertyOwnerService.getAllPropertyOwners().subscribe({
      next: (owners: PropertyOwner[]) => {
        this.propertyOwners = owners;
      },
      error: (err) => {
        console.error('Failed to fetch property owners:', err);
        alert('Failed to load property owners. Please try again.');
      }
    });

    // Initialize the form
    this.propertyForm = new FormGroup({
      numberE9: new FormControl('', [
        Validators.required,
        Validators.pattern("^\\d{5}$") // Pattern for exactly 5 digits
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
      // Limit to 5 digits
      if (value.length > 5) {
        value = value.slice(0, 5);
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
        .pipe(catchError((err) => {
          console.log(err);
          alert(err.error);
          return EMPTY;
        }))
        .subscribe(() => {
          alert('Property created successfully!');
          this.router.navigate(['/admin-properties']);
        });
    } else {
      alert('Please fill in all required fields correctly before submitting.');
    }
  }

  // Added cancel() method
  cancel() {
    this.router.navigate(['/admin-properties']);
  }
}
