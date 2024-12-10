import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { Repair } from '../../shared/model/repair';
import { RepairService } from '../../shared/services/repair.service';

@Component({
  selector: 'app-admin-repairs-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-repairs-page.component.html',
  styleUrls: ['./admin-repairs-page.component.scss']
})
export class AdminRepairsPageComponent implements OnInit {
  repairs: Repair[] = [];

  constructor(private repairService: RepairService, private router: Router) {}

  ngOnInit(): void {
    this.loadRepairs();
  }

  loadRepairs() {
    this.repairService.getAllRepairs().subscribe((reps: Repair[]) => {
      this.repairs = reps;
    });
  }

  // Add this method
  updateRepair(repair: Repair) {
    this.router.navigate(['/edit-repair', repair.id]);
  }

  deleteRepair(repair: Repair) {
    if (confirm(`Are you sure you want to delete repair ${repair.id}?`)) {
      this.repairService.deleteRepairById(repair.id).subscribe({
        next: () => this.loadRepairs(),
        error: (err: any) => {
          console.error(err);
          alert('Failed to delete repair.');
        }
      });
    }
  }

  backToHome(){
    this.router.navigate(['/admin-home']);
  }
}
