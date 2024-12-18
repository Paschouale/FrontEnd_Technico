// src/app/pages/admin-pages/edit-owner.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyOwnerService } from '../../shared/services/property-owner.service';
import { PropertyOwner } from '../../shared/model/property-owner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  @ViewChild('successModal') successModal!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ownerService: PropertyOwnerService,
    private modalService: NgbModal // Inject NgbModal
  ) { }

  ngOnInit(): void {
    this.ownerId = Number(this.route.snapshot.paramMap.get('id'));

    this.ownerForm = new FormGroup({
      vatNumber: new FormControl('', [Validators.required, Validators.pattern("\\d{9}")]),
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      address: new FormControl(''),
      phoneNumber: new FormControl('', Validators.pattern("^[26]\\d{9}$")),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
      username: new FormControl('', Validators.minLength(5)),
      password: new FormControl('', Validators.minLength(4))
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
          password: ''
        });
      },
      error: err => {
        console.error('Failed to load owner data', err);
        // Open Error Modal
        this.modalService.open(this.errorModal);
      }
    });
  }

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

      this.ownerService.updatePropertyOwnerById(this.ownerId, updatedOwner)
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
          // this.router.navigate(["/admin-owners"]);
        });
    } else {
      // Open Error Modal if form is invalid
      this.modalService.open(this.errorModal);
    }
  }

  cancel() {
    this.router.navigate(['/admin-owners']);
  }
}
