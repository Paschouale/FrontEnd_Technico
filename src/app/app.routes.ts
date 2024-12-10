import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminHomepageComponent } from './admin-homepage/admin-homepage.component';
import { OwnerHomepageComponent } from './owner-homepage/owner-homepage.component';
import { CreatePropertyOwnerComponent } from './pages/homepage/components/property-owners/create-property-owner/create-property-owner.component';
import { AdminOwnersPageComponent } from './pages/admin-pages/admin-owners-page.component';
import { AdminPropertiesPageComponent } from './pages/admin-pages/admin-properties-page.component';
import { AdminRepairsPageComponent } from './pages/admin-pages/admin-repairs-page.component';
import { EditOwnerComponent } from './pages/admin-pages/edit-owner.component';
import { EditPropertyComponent } from './pages/admin-pages/edit-property.component';
import { EditRepairComponent } from './pages/admin-pages/edit-repair.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin-home', component: AdminHomepageComponent },
  { path: 'owner-home', component: OwnerHomepageComponent },
  { path: 'create-owner', component: CreatePropertyOwnerComponent },
  { path: 'admin-owners', component: AdminOwnersPageComponent },
  { path: 'admin-properties', component: AdminPropertiesPageComponent },
  { path: 'edit-owner/:id', component: EditOwnerComponent },
{ path: 'edit-property/:id', component: EditPropertyComponent },
{ path: 'edit-repair/:id', component: EditRepairComponent },

  { path: 'admin-repairs', component: AdminRepairsPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
