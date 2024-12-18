// src/app/pages/contact-us/contact-us.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal and NgbModalModule
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule], // Include NgbModalModule
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private modalService: NgbModal, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required, Validators.maxLength(1000)])
    });
  }

  onSubmit(content: any): void {
    if (this.contactForm.valid) {
      // Handle form submission logic here (e.g., send data to a backend service)
      console.log('Form Submitted', this.contactForm.value);

      // Reset the form after submission
      this.contactForm.reset();

      // Open the confirmation modal
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    } else {
      // Mark all controls as touched to trigger validation messages
      this.contactForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    // Redirect to Owner Home Page
    this.router.navigate(['/owner-home']);
  }
}
