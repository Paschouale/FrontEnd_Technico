import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepairService } from '../../../../../shared/services/repair.service';
import { Router } from '@angular/router';
import { RepairType } from '../../../../../shared/enumeration/repair-type';
import { RepairStatus } from '../../../../../shared/enumeration/repair-status';
import { CommonModule } from '@angular/common';

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

  constructor(private repairService: RepairService, private router: Router) {}

  ngOnInit(): void {
    this.repairForm = new FormGroup({
      scheduledRepairDate: new FormControl('', Validators.required),
      repairStatus: new FormControl(RepairStatus.STANDBY, Validators.required),
      repairType: new FormControl('', Validators.required),
      cost: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl('', Validators.required),
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

      this.repairService.createRepair(formValue).subscribe({
        next: () => this.router.navigate(['/admin-repairs']),
        error: (err) => console.error('Failed to create repair:', err)
      });
    }
  }
}
