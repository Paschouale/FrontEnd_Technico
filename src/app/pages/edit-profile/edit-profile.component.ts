// src/app/edit-profile/edit-profile.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Router } from '@angular/router';

import { EMPTY, catchError } from 'rxjs';
import { PropertyOwner } from '../../shared/model/property-owner';
import { PropertyOwnerService } from '../../shared/services/property-owner.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  ownerForm!: FormGroup;
  ownerId!: number;
  owner!: PropertyOwner;

  constructor(
    private propertyOwnerService: PropertyOwnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.ownerId = user.propertyOwnerId;

      if (this.ownerId) {
        // Fetch Property Owner details
        this.propertyOwnerService.getPropertyOwnerById(this.ownerId).subscribe({
          next: (owner) => {
            this.owner = owner;
            this.initializeForm();
          },
          error: (err) => {
            console.error('Failed to fetch property owner details:', err);
            alert('Failed to load your details. Please try again later.');
            this.router.navigate(['/owner-home']);
          }
        });
      } else {
        alert('Property Owner ID not found. Please log in again.');
        this.router.navigate(['/login']);
      }
    } else {
      alert('User not found. Please log in.');
      this.router.navigate(['/login']);
    }
  }

  initializeForm(): void {
    this.ownerForm = new FormGroup({
      vatNumber: new FormControl(this.owner.vatNumber || '', [Validators.required, Validators.pattern("\\d{9}")]),
      name: new FormControl(this.owner.name || '', Validators.required),
      surname: new FormControl(this.owner.surname || '', Validators.required),
      address: new FormControl(this.owner.address || ''),
      phoneNumber: new FormControl(this.owner.phoneNumber || '', Validators.pattern("^[26]\\d{9}$")),
      email: new FormControl(this.owner.email || '', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
      username: new FormControl(this.owner.loginUser?.username || '', Validators.minLength(5)),
      password: new FormControl('', Validators.minLength(4)),
      confirmPassword: new FormControl('', Validators.minLength(4))
    }, { validators: this.passwordMatchValidator });
  }

  // **Custom Validator Function**
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const form = control as FormGroup;
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password || confirmPassword) { // Only validate if one of them is filled
      return password === confirmPassword ? null : { mismatch: true };
    }
    return null;
  }

  // **Method to Submit Edit Profile Form**
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
          alert('Profile updated successfully!');
          // Update local storage if necessary
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.username = updatedOwner.loginUser?.username;
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.router.navigate(['/owner-home']);
        });
    } else {
      alert('Please fix the errors in the form before submitting.');
    }
  }

  // **Method to Cancel Editing**
  cancelEdit(): void {
    if (confirm('Are you sure you want to cancel editing your profile? Unsaved changes will be lost.')) {
      this.router.navigate(['/owner-home']);
    }
  }

  // **Method to Logout from Edit Profile Page**
  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
