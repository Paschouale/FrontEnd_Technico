import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyOwnerService } from '../../../../shared/services/property-owner.service';
import { PropertyOwner } from '../../../../shared/model/property-owner';

@Component({
  selector: 'app-property-owners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-owners.component.html',
  styleUrls: ['./property-owners.component.scss']
})
export class PropertyOwnersComponent {
  propertyOwners: PropertyOwner[] = [];

  constructor(private propertyOwnerService: PropertyOwnerService){
    propertyOwnerService.getAllPropertyOwners().subscribe((result: PropertyOwner[]) => {
      this.propertyOwners = result;
    });
  }
}
