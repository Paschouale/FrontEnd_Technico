import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../shared/services/property.service';
import { Property } from '../../shared/model/property';
import { PropertyType } from '../../shared/enumeration/property-type';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss']
})
export class EditPropertyComponent implements OnInit {
  propertyForm!: FormGroup;
  propertyId!: number;
  propertyTypes = Object.values(PropertyType);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialize form with empty values
    this.propertyForm = new FormGroup({
      numberE9: new FormControl('', Validators.required),
      address: new FormControl(''),
      yearOfConstruction: new FormControl(''),
      propertyType: new FormControl('', Validators.required),
      // If you want to allow changing owner, you can include a field for owner ID or similar
      // propertyOwnerId: new FormControl('', Validators.required)
    });

    this.loadProperty();
  }

  loadProperty() {
    this.propertyService.getPropertyById(this.propertyId).subscribe({
      next: (property: Property) => {
        this.propertyForm.setValue({
          numberE9: property.numberE9 || '',
          address: property.address || '',
          yearOfConstruction: property.yearOfConstruction || '',
          propertyType: property.propertyType || ''
          // If editing owner: 
          // propertyOwnerId: property.propertyOwner?.id || ''
        });
      },
      error: err => {
        console.error('Failed to load property data', err);
        alert('Failed to load property data');
      }
    });
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const updatedProperty: Property = {
        ...this.propertyForm.value,
        id: this.propertyId,
        // If you need to re-attach the owner based on propertyOwnerId:
        // propertyOwner: { id: this.propertyForm.get('propertyOwnerId')?.value } as PropertyOwner
      };

      this.propertyService.updatePropertyById(this.propertyId, updatedProperty)
      .pipe(catchError((err) => {
        console.log(err);
        alert(err.error);
        return EMPTY
      }))
      .subscribe(() => {
        alert('Property updated successfully!');
        this.router.navigate(['/admin-properties']);
      });
  }
      else {
      alert('Please fill in all required fields correctly before submitting.');
    }
  }

  cancel() {
    this.router.navigate(['/admin-properties']);
  }
}
