import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { PropertyService } from '../../shared/services/property.service';
import { Property } from '../../shared/model/property';

@Component({
  selector: 'app-admin-properties-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-properties-page.component.html',
  styleUrls: ['./admin-properties-page.component.scss']
})
export class AdminPropertiesPageComponent implements OnInit {
  properties: Property[] = [];

  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getAllProperties().subscribe((props: Property[]) => {
      this.properties = props;
    });
  }

  // Add this method to handle the update navigation
  updateProperty(property: Property) {
    // Navigate to the edit page with the property's id
    this.router.navigate(['/edit-property', property.id]);
  }

  deleteProperty(property: Property) {
    if (confirm(`Are you sure you want to delete property ${property.id}?`)) {
      this.propertyService.deletePropertyByPropertyIdNumber(property.id).subscribe({
        next: () => this.loadProperties(),
        error: (err: any) => {
          console.error(err);
          alert('Failed to delete property.');
        }
      });
    }
  }

  backToHome(){
    this.router.navigate(['/admin-home']);
  }
}
