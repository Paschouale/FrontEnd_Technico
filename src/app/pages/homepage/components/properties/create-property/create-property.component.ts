// import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { PropertyService } from '../../../../../shared/services/property.service';
// import { Router } from '@angular/router';
// import { PropertyType } from '../../../../../shared/enumeration/property-type';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-create-property',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './create-property.component.html',
//   styleUrls: ['./create-property.component.scss'] // Fixed the typo
// })
// export class CreatePropertyComponent implements OnInit {

//   propertyForm!: FormGroup;
//   propertyTypes = Object.values(PropertyType); // Populate property types

//   constructor(private propertyService: PropertyService, private router: Router) {}

//   ngOnInit(): void {
//     this.propertyForm = new FormGroup({
//       numberE9: new FormControl('', Validators.required),
//       address: new FormControl('', Validators.required),
//       yearOfConstruction: new FormControl('', Validators.required),
//       propertyType: new FormControl('', Validators.required),
//       propertyOwner: new FormGroup({
//         id: new FormControl('', Validators.required)
//       })
//     });
//   }

//   onSubmit() {
//     if (this.propertyForm.valid) {
//       const formValue = {
//         ...this.propertyForm.value,
//         propertyOwner: {
//           id: this.propertyForm.get('propertyOwner.id')?.value
//         }
//       };

//       this.propertyService.postProperty(formValue).subscribe({
//         next: () => this.router.navigate(['/admin-properties']),
//         error: (err) => console.error('Failed to create property:', err)
//       });
//     }
//   }
// }
// create-property.component.ts
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
      numberE9: new FormControl('', Validators.required),
      address: new FormControl(''),
      yearOfConstruction: new FormControl(''),
      propertyType: new FormControl('', Validators.required),
      propertyOwner: new FormGroup({
        id: new FormControl('', Validators.required)
      })
    });
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const formValue = {
        ...this.propertyForm.value,
        propertyOwner: {
          id: this.propertyForm.get('propertyOwner.id')?.value
        }
      };

      this.propertyService.postProperty(formValue)
        .pipe(catchError((err) => {
          console.log(err);
          alert(err.error);
          return EMPTY
        }))
        .subscribe(() => {
          alert('Property created successfully!');
          this.router.navigate(['/admin-properties']);
        });
    }
  }
}
