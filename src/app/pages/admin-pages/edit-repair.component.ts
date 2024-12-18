// src/app/pages/admin-pages/edit-repair.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepairService } from '../../shared/services/repair.service';
import { Repair } from '../../shared/model/repair';
import { RepairType } from '../../shared/enumeration/repair-type';
import { RepairStatus } from '../../shared/enumeration/repair-status';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-edit-repair',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-repair.component.html',
  styleUrls: ['./edit-repair.component.scss']
})
export class EditRepairComponent implements OnInit {
  repairForm!: FormGroup;
  repairId!: number;
  repairTypes = Object.values(RepairType);
  repairStatuses = Object.values(RepairStatus);

  @ViewChild('successModal') successModal!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repairService: RepairService,
    private modalService: NgbModal // Inject NgbModal
  ) {}

  ngOnInit(): void {
    this.repairId = Number(this.route.snapshot.paramMap.get('id'));

    this.repairForm = new FormGroup({
      scheduledRepairDate: new FormControl('', Validators.required),
      repairStatus: new FormControl('', Validators.required),
      repairType: new FormControl('', Validators.required),
      cost: new FormControl('', [Validators.min(0)]),
      description: new FormControl(''),
      // If you allow changing the property linked to the repair:
      // propertyId: new FormControl('', Validators.required)
    });

    this.loadRepair();
  }

  loadRepair() {
    this.repairService.getRepairById(this.repairId).subscribe({
      next: (repair: Repair) => {
        this.repairForm.setValue({
          scheduledRepairDate: repair.scheduledRepairDate?.toString().slice(0,16) || '',
          repairStatus: repair.repairStatus || '',
          repairType: repair.repairType || '',
          cost: repair.cost?.toString() || '',
          description: repair.description || ''
          // If editing property: propertyId: repair.property?.id || ''
        });
      },
      error: err => {
        console.error('Failed to load repair data', err);
        // Open Error Modal
        this.modalService.open(this.errorModal);
      }
    });
  }

  onSubmit() {
    if (this.repairForm.valid) {
      const updatedRepair: Repair = {
        ...this.repairForm.value,
        id: this.repairId,
        // Convert cost to number if it's a string:
        cost: Number(this.repairForm.get('cost')?.value),
        // Convert scheduledRepairDate to a Date object if needed:
        scheduledRepairDate: new Date(this.repairForm.get('scheduledRepairDate')?.value),
        // If editing property: property: { id: this.repairForm.get('propertyId')?.value } as Property
      };

      this.repairService.updateRepairById(this.repairId, updatedRepair)
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
          // this.router.navigate(['/admin-repairs']);
        });
    } else {
      // Open Error Modal if form is invalid
      this.modalService.open(this.errorModal);
    }
  }

  cancel() {
    this.router.navigate(['/admin-repairs']);
  }
}
