import { Routes } from '@angular/router';

import { AdminHomepageComponent } from './admin-homepage/admin-homepage.component';
import { OwnerHomepageComponent } from './owner-homepage/owner-homepage.component';
import { CreatePropertyOwnerComponent } from './pages/homepage/components/property-owners/create-property-owner/create-property-owner.component';
import { CreatePropertyComponent } from './pages/homepage/components/properties/create-property/create-property.component';
import { CreateRepairComponent } from './pages/homepage/components/repairs/create-repair/create-repair.component';
import { AdminOwnersPageComponent } from './pages/admin-pages/admin-owners-page.component';
import { AdminPropertiesPageComponent } from './pages/admin-pages/admin-properties-page.component';
import { AdminRepairsPageComponent } from './pages/admin-pages/admin-repairs-page.component';
import { EditOwnerComponent } from './pages/admin-pages/edit-owner.component';
import { EditPropertyComponent } from './pages/admin-pages/edit-property.component';
import { EditRepairComponent } from './pages/admin-pages/edit-repair.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin-home', component: AdminHomepageComponent },
  { path: 'owner-home', component: OwnerHomepageComponent },

  // Create Routes
  { path: 'create-owner', component: CreatePropertyOwnerComponent },
  { path: 'create-property', component: CreatePropertyComponent },
  { path: 'create-repair', component: CreateRepairComponent },

  // Admin Management Pages
  { path: 'admin-owners', component: AdminOwnersPageComponent },
  { path: 'admin-properties', component: AdminPropertiesPageComponent },
  { path: 'admin-repairs', component: AdminRepairsPageComponent },

  // Edit Pages
  { path: 'edit-owner/:id', component: EditOwnerComponent },
  { path: 'edit-property/:id', component: EditPropertyComponent },
  { path: 'edit-repair/:id', component: EditRepairComponent },

 { path: 'contact-us', component: ContactUsComponent}, 
 {path: 'about-us',component: AboutUsComponent}, 


  // Default Redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
