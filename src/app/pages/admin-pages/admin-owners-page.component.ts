import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyOwnerService } from '../../shared/services/property-owner.service';
import { PropertyOwner } from '../../shared/model/property-owner';

@Component({
  selector: 'app-admin-owners-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-owners-page.component.html',
  styleUrls: ['./admin-owners-page.component.scss']
})
export class AdminOwnersPageComponent implements OnInit {
  propertyOwners: PropertyOwner[] = [];

  constructor(private propertyOwnerService: PropertyOwnerService, private router: Router) {}

  ngOnInit(): void {
    this.loadOwners();
  }

  loadOwners() {
    this.propertyOwnerService.getAllPropertyOwners().subscribe((owners: PropertyOwner[]) => {
      this.propertyOwners = owners;
    });
  }

  updateOwner(owner: PropertyOwner) {
    this.router.navigate(['/edit-owner', owner.id]);
  }

  deleteOwner(owner: PropertyOwner) {
    // Implement delete if needed
  }

  backToHome(){
    this.router.navigate(['/admin-home']);
  }
}
