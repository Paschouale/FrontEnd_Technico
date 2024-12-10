import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Repair } from '../shared/model/repair';
import { RepairService } from '../shared/services/repair.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner-homepage.component.html',
  styleUrls: ['./owner-homepage.component.scss']
})
export class OwnerHomepageComponent implements OnInit {
  repairs: Repair[] = [];
  username: string | null = null;

  showModal: boolean = false;
  selectedRepair: Repair | null = null;
  updateMessage: string = '';

  constructor(private repairService: RepairService, private router: Router) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.username = user.username;
      const ownerId = user.propertyOwnerId;
      if (ownerId) {
        this.repairService.getRepairsByPropertyOwnerId(ownerId).subscribe((result: Repair[]) => {
          this.repairs = result;
        });
      }
    }
  }

  requestUpdate(repair: Repair) {
    this.selectedRepair = repair;
    this.updateMessage = '';
    this.showModal = true;
  }

//   sendUpdateRequest() {
//     if (this.selectedRepair && this.updateMessage.trim()) {
//       // Call the service method to send the request
//       this.repairService.sendStatusUpdateRequest(this.selectedRepair.id, this.updateMessage).subscribe({
//         next: () => {
//           alert('Your update request has been sent successfully.');
//           this.showModal = false;
//         },
//         error: (err) => {
//           console.error(err);
//           alert('Failed to send update request.');
//         }
//       });
//     } else {
//       alert('Please enter a message before sending the request.');
//     }
//   }

//   closeModal() {
//     this.showModal = false;
//   }
// }
sendUpdateRequest() {
  if (this.selectedRepair && this.updateMessage.trim()) {
    // Call the service method to send the request
    this.repairService
      .sendStatusUpdateRequest(this.selectedRepair.id, this.updateMessage)
      .subscribe({
        next: () => {
          alert('Your update request has been sent successfully.');
          this.showModal = false;
        },
        error: (err) => {
          console.error(err);
          alert('Failed to send update request.');
        },
      });
  } else {
    alert('Please enter a message before sending the request.');
  }
}

closeModal() {
  this.showModal = false;
}

logout(): void {
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}
}