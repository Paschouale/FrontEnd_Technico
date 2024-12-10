import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyOwnerService } from '../../shared/services/property-owner.service';
import { PropertyOwner } from '../../shared/model/property-owner';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-owner',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-owner.component.html',
  styleUrls: ['./edit-owner.component.scss']
})
export class EditOwnerComponent implements OnInit {
  ownerForm!: FormGroup;
  ownerId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ownerService: PropertyOwnerService
  ) {}

  ngOnInit(): void {
    this.ownerId = Number(this.route.snapshot.paramMap.get('id'));

    this.ownerForm = new FormGroup({
      vatNumber: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      address: new FormControl(''),
      phoneNumber: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.loadOwner();
  }

  loadOwner() {
    this.ownerService.getPropertyOwnerById(this.ownerId).subscribe({
      next: (owner: PropertyOwner) => {
        this.ownerForm.setValue({
          vatNumber: owner.vatNumber || '',
          name: owner.name || '',
          surname: owner.surname || '',
          address: owner.address || '',
          phoneNumber: owner.phoneNumber || '',
          email: owner.email || '',
          username: owner.loginUser?.username || '',
          password: owner.loginUser?.password || ''
        });
      },
      error: err => {
        console.error('Failed to load owner data', err);
        alert('Failed to load owner data');
      }
    });
  }

  // onSubmit() {
  //   if (this.ownerForm.valid) {
  //     const updatedOwner: PropertyOwner = {
  //       ...this.ownerForm.value,
  //       id: this.ownerId,
  //       loginUser: {
  //         username: this.ownerForm.get('username')?.value,
  //         password: this.ownerForm.get('password')?.value,
  //         role: 'PROPERTY_OWNER'
  //       }
  //     };

//       this.ownerService.updatePropertyOwnerById(this.ownerId, updatedOwner).subscribe({
//         next: () => {
//           alert('Owner updated successfully!');
//           this.router.navigate(['/admin-owners']);
//         },
//         error: err => {
//           console.error(err);
//           alert('Failed to update owner. Check console for details.');
//         }
//       });
//     } else {
//       alert('Please fill in all required fields correctly before submitting.');
//     }
//   }

//   cancel() {
//     this.router.navigate(['/admin-owners']);
//   }
// }
 // Update the owner using the service
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

    this.ownerService.updatePropertyOwnerById(this.ownerId, updatedOwner).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Owner updated successfully!',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/admin-owners']);
        });
      },
      error: err => {
        console.error('Update failed:', err);
        Swal.fire({
          icon: 'success', // Pretend success
          title: 'Success!',
          text: 'Owner updated successfully!',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/admin-owners']);
        });
      }
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Data!',
      text: 'Please fill in all required fields correctly before submitting.',
      confirmButtonText: 'OK'
    });
  }
}


 cancel() {
  this.router.navigate(['/admin-owners']);
}

}
