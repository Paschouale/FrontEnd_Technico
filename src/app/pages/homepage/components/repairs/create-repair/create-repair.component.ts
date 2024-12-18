// src/app/pages/homepage/components/property-owners/create-repair/create-repair.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RepairService } from '../../../../../shared/services/repair.service';
import { Router } from '@angular/router';
import { RepairType } from '../../../../../shared/enumeration/repair-type';
import { RepairStatus } from '../../../../../shared/enumeration/repair-status';
import { CommonModule } from '@angular/common';
import { EMPTY, catchError } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal

@Component({
  selector: 'app-create-repair',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-repair.component.html',
  styleUrls: ['./create-repair.component.scss']
})
export class CreateRepairComponent implements OnInit {

  repairForm!: FormGroup;
  repairTypes = Object.values(RepairType);
  repairStatuses = Object.values(RepairStatus);

  errorMessages: string[] = []; // Array to hold dynamic error messages

  @ViewChild('successModal') successModal!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;

  constructor(private repairService: RepairService, private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.repairForm = new FormGroup({
      scheduledRepairDate: new FormControl('', []),
      repairStatus: new FormControl('', Validators.required),
      repairType: new FormControl('', Validators.required),
      cost: new FormControl('', [Validators.min(0)]),
      description: new FormControl(''),
      property: new FormGroup({
        id: new FormControl('', Validators.required)
      })
    });
  }

  onSubmit() {
    if (this.repairForm.valid) {
      const formValue = {
        ...this.repairForm.value,
        property: {
          id: this.repairForm.get('property.id')?.value
        }
      };

      this.repairService.createRepair(formValue)
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
          this.router.navigate(["/admin-repairs"]);
        });
    } else {
      // Set a general error message for invalid form
      this.errorMessages = ['Please fill in all required fields correctly before submitting.'];
      // Open Error Modal with the general error message
      this.modalService.open(this.errorModal, { ariaLabelledBy: 'error-modal-title' });
    }
  }

  cancel() {
    this.router.navigate(['/admin-repairs']);
  }

  onScheduledDateChange(inputElement: HTMLInputElement) {
    // Once the user picks a value, blur the input field to close the native date-time picker
    inputElement.blur();
  }
}
