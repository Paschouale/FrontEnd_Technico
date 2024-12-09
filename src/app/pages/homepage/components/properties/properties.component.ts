import { Component } from '@angular/core';
import { Property } from '../../../../shared/model/property';
import { PropertyService } from '../../../../shared/services/property.service';
import { PropertyType } from '../../../../shared/enumeration/property-type';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent {
  properties: Property[] = [];

  constructor(private propertyService: PropertyService){
    propertyService.getAllProperties().subscribe((result: Property[]) => {
      for (let property of result){
        this.properties.push({
          id: property.id,
          numberE9: property.numberE9,
          address: property.address,
          yearOfConstruction: property.yearOfConstruction,
          propertyType: property.propertyType,
          propertyOwner: property.propertyOwner,
          repairList: property.repairList
         })
      }
    })
  }
}
