import { Component } from '@angular/core';
import { PropertyOwner } from '../../../../shared/model/property-owner';
import { PropertyOwnerService } from '../../../../shared/services/property-owner.service';
import { PublishService } from '../../../../shared/services/publish.service';

@Component({
  selector: 'app-property-owners',
  standalone: true,
  imports: [],
  templateUrl: './property-owners.component.html',
  styleUrl: './property-owners.component.scss'
})
export class PropertyOwnersComponent {
  propertyOwners: PropertyOwner[] = [];

  constructor(private propertyOwnerService: PropertyOwnerService){
    propertyOwnerService.getAllPropertyOwners().subscribe((result: PropertyOwner[]) => {
      for (let propertyOwner of result){
        this.propertyOwners.push({
          id: propertyOwner.id,
          vatNumber: propertyOwner.vatNumber,
          name: propertyOwner.name,
          surname: propertyOwner.surname,
          address: propertyOwner.address,
          phoneNumber: propertyOwner.phoneNumber,
          email: propertyOwner.email,
          propertyList: propertyOwner.propertyList,
          loginUser: propertyOwner.loginUser
         })
      }
    })
  }
}
