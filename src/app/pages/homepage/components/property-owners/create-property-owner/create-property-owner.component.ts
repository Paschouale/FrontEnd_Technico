// src/app/pages/homepage/components/property-owners/create-property-owner/create-property-owner.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyOwnerService } from '../../../../../shared/services/property-owner.service';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal

@Component({
  selector: 'app-create-property-owner',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-property-owner.component.html',
  styleUrls: ['./create-property-owner.component.scss']
})
export class CreatePropertyOwnerComponent implements OnInit {
  propertyOwnerForm!: FormGroup;
  errorMessages: string[] = []; // Array to hold dynamic error messages

  @ViewChild('successModal') successModal!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;

  constructor(
    private propertyOwnerService: PropertyOwnerService,
    private router: Router,
    private modalService: NgbModal // Inject NgbModal
  ) { }

  ngOnInit(): void {
    this.propertyOwnerForm = new FormGroup({
      vatNumber: new FormControl("", [
        Validators.required,
        Validators.pattern("\\d{9}") // Exactly 9 digits
      ]),
      name: new FormControl("", Validators.required),
      surname: new FormControl("", Validators.required),
      address: new FormControl(""),
      phoneNumber: new FormControl("", Validators.pattern("^[26]\\d{9}$")), // Starts with 2 or 6, exactly 10 digits
      email: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") // Valid email format
      ]),
      loginUser: new FormGroup({
        username: new FormControl("", [
          Validators.required,
          Validators.minLength(5)
        ]),
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(4)
        ]),
      })
    });
  }

  onSubmit() {
    console.log(this.propertyOwnerForm);
    if (this.propertyOwnerForm.valid) {
      const formValue = {
        ...this.propertyOwnerForm.value,
        loginUser: {
          username: this.propertyOwnerForm.get('loginUser.username')?.value,
          password: this.propertyOwnerForm.get('loginUser.password')?.value,
        },
      };
      this.propertyOwnerService.createPropertyOwner(formValue)
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
          // Open Success Modal upon successful creation
          this.modalService.open(this.successModal, { ariaLabelledBy: 'success-modal-title' });
          // Optionally, navigate after closing modal
          this.router.navigate(["/admin-owners"]);
        });
    } else {
      // Set a general error message for invalid form
      this.errorMessages = ['Please fill in all required fields correctly before submitting.'];
      // Open Error Modal with the general error message
      this.modalService.open(this.errorModal, { ariaLabelledBy: 'error-modal-title' });
    }
  }

  // Cancel method to navigate away
  cancel() {
    this.router.navigate(['/admin-owners']);
  }
}
