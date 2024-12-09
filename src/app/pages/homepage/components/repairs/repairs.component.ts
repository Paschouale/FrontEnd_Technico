import { Component } from '@angular/core';
import { Repair } from '../../../../shared/model/repair';
import { RepairService } from '../../../../shared/services/repair.service';

@Component({
  selector: 'app-repairs',
  standalone: true,
  imports: [],
  templateUrl: './repairs.component.html',
  styleUrl: './repairs.component.scss'
})
export class RepairsComponent {
  repairs: Repair[] = [];

  constructor(private repairService: RepairService){
    repairService.getAllRepairs().subscribe((result: Repair[]) => {
      for (let repair of result){
        this.repairs.push({
          id: repair.id,
          repairStatus: repair.repairStatus,
          repairType: repair.repairType,
          cost: repair.cost,
          property: repair.property,
          description: repair.description
         })
      }
    })
  }
}
