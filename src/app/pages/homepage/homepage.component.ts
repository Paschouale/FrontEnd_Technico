import { Component } from '@angular/core';
import { PropertyOwnersComponent } from "./components/property-owners/property-owners.component";
import { PropertiesComponent } from "./components/properties/properties.component";
import { RepairsComponent } from "./components/repairs/repairs.component";
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [PropertyOwnersComponent, PropertiesComponent, RepairsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

  constructor(private router: Router){}
  
  navigateToCreateOwner(): void {
    this.router.navigate(['/create-owner']);
  }

  navigateToCreateProperty(): void {
    this.router.navigate(['/create-property']);
  }
}
