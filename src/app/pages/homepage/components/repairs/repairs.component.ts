// import { Component } from '@angular/core';
// import { Repair } from '../../../../shared/model/repair';
// import { RepairService } from '../../../../shared/services/repair.service';

// @Component({
//   selector: 'app-repairs',
//   standalone: true,
//   imports: [],
//   templateUrl: './repairs.component.html',
//   styleUrl: './repairs.component.scss'
// })
// export class RepairsComponent {
//   repairs: Repair[] = [];

//   constructor(private repairService: RepairService){
//     repairService.getAllRepairs().subscribe((result: Repair[]) => {
//       for (let repair of result){
//         this.repairs.push({
//           id: repair.id,
//           repairStatus: repair.repairStatus,
//           repairType: repair.repairType,
//           cost: repair.cost,
//           property: repair.property,
//           description: repair.description
//          })
//       }
//     })
//   }
// }
import { Component, OnInit } from '@angular/core';
import { Repair } from '../../../../shared/model/repair';
import { RepairService } from '../../../../shared/services/repair.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repairs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repairs.component.html',
  styleUrls: ['./repairs.component.scss']
})
export class RepairsComponent implements OnInit {
  repairs: Repair[] = [];
  isAdmin: boolean = false;

  constructor(private repairService: RepairService){}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.isAdmin = parsedUser.role === 'ADMIN';

      if (this.isAdmin) {
        this.repairService.getAllRepairs().subscribe((result: Repair[]) => {
          this.repairs = result;
        });
      } else {
        const ownerId = parsedUser.propertyOwnerId;
        if (ownerId) {
          // This will now work if the service returns an Observable<Repair[]>
          this.repairService.getRepairsByPropertyOwnerId(ownerId).subscribe((result: Repair[]) => {
            this.repairs = result;
          });
        }
      }
    }
  }
}
