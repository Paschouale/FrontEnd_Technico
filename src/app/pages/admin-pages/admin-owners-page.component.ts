import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PropertyOwnerService } from '../../shared/services/property-owner.service';
import { PropertyOwner } from '../../shared/model/property-owner';

@Component({
  selector: 'app-admin-owners-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-owners-page.component.html',
  styleUrls: ['./admin-owners-page.component.scss'],
})
export class AdminOwnersPageComponent implements OnInit {
  propertyOwners: PropertyOwner[] = [];

  constructor(private propertyOwnerService: PropertyOwnerService, private router: Router) {}

  ngOnInit(): void {
    this.loadOwners();
  }

  loadOwners() {
    this.propertyOwnerService.getAllPropertyOwners().subscribe((owners: PropertyOwner[]) => {
      turnOwnerPasswordsIntoAsterisks(owners);
      this.propertyOwners = owners;
    });
  }

  navigateToCreateOwner() {
    this.router.navigate(['/create-owner']);
  }

  updateOwner(owner: PropertyOwner) {
    this.router.navigate(['/edit-owner', owner.id]);
  }

  deletePropertyOwner(owner: PropertyOwner) {
    if (confirm(`Are you sure you want to delete property ${owner.id}?`)) {
      this.propertyOwnerService.deletePropertyOwnerById(owner.id).subscribe({
        next: () => this.loadOwners(),
        error: (err: any) => {
          console.error(err);
          alert('Failed to delete property owner.');
        },
      });
    }
  }

  backToHome() {
    this.router.navigate(['/admin-home']);
  }
}
function turnOwnerPasswordsIntoAsterisks(owners: PropertyOwner[]) {
  owners.forEach((owner) => {
    owner.loginUser.password = '****';
  });
}

