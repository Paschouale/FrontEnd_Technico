import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyOwnersComponent } from './components/property-owners/property-owners.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { RepairsComponent } from './components/repairs/repairs.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, PropertyOwnersComponent, PropertiesComponent, RepairsComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  constructor(private router: Router){}

  navigateToCreateOwner(): void {
    this.router.navigate(['/create-owner']);
  }
}
