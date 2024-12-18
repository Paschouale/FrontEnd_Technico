// src/app/pages/admin-pages/edit-property.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../shared/services/property.service';
import { Property } from '../../shared/model/property';
import { PropertyType } from '../../shared/enumeration/property-type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  @ViewChild('successModal') successModal!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private modalService: NgbModal // Inject NgbModal
  ) {}

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialize form with empty values
    this.propertyForm = new FormGroup({
      numberE9: new FormControl('', Validators.required),
      address: new FormControl(''),
      yearOfConstruction: new FormControl(''),
      propertyType: new FormControl('', Validators.required),
      // If you want to allow changing owner, include a field for owner ID or similar
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
          // If editing owner: propertyOwnerId: property.propertyOwner?.id || ''
        });
      },
      error: err => {
        console.error('Failed to load property data', err);
        // Open Error Modal
        this.modalService.open(this.errorModal);
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
        .pipe(
          catchError((err) => {
            console.log(err);
            // Open Error Modal
            this.modalService.open(this.errorModal);
            return EMPTY;
          })
        )
        .subscribe(() => {
          // Open Success Modal
          this.modalService.open(this.successModal);
          // Optionally, navigate after closing modal
          // this.router.navigate(['/admin-properties']);
        });
    } else {
      // Open Error Modal if form is invalid
      this.modalService.open(this.errorModal);
    }
  }

  cancel() {
    this.router.navigate(['/admin-properties']);
  }
}
