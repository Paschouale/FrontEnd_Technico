import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepairService } from '../../shared/services/repair.service';
import { Repair } from '../../shared/model/repair';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repairService: RepairService
  ) {}

  ngOnInit(): void {
    this.repairId = Number(this.route.snapshot.paramMap.get('id'));

    this.repairForm = new FormGroup({
      scheduledRepairDate: new FormControl('', Validators.required),
      repairStatus: new FormControl('', Validators.required),
      repairType: new FormControl('', Validators.required),
      cost: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      // If you allow changing the property linked to the repair:
      // propertyId: new FormControl('', Validators.required)
    });

    this.loadRepair();
  }

  loadRepair() {
    this.repairService.getRepairById(this.repairId).subscribe({
      next: (repair: Repair) => {
        this.repairForm.setValue({
          scheduledRepairDate: repair.scheduledRepairDate?.toString() || '',
          repairStatus: repair.repairStatus || '',
          repairType: repair.repairType || '',
          cost: repair.cost?.toString() || '',
          description: repair.description || ''
          // If editing property: propertyId: repair.property?.id || ''
        });
      },
      error: err => {
        console.error('Failed to load repair data', err);
        alert('Failed to load repair data');
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
        // Convert scheduledRepairDate to a Date or LocalDateTime if needed.
        // If editing property: property: { id: this.repairForm.get('propertyId')?.value } as Property
      };

      this.repairService.updateRepairById(this.repairId, updatedRepair).subscribe({
        next: () => {
          alert('Repair updated successfully!');
          this.router.navigate(['/admin-repairs']);
        },
        error: err => {
          console.error(err);
          alert('Failed to update repair.');
        }
      });
    } else {
      alert('Please fill in all required fields correctly before submitting.');
    }
  }

  cancel() {
    this.router.navigate(['/admin-repairs']);
  }
}
