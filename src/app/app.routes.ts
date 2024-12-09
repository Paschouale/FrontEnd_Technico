import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { CreatePropertyOwnerComponent } from './pages/homepage/components/property-owners/create-property-owner/create-property-owner.component';

export const routes: Routes = [
    {
        path: "",
        component: HomepageComponent
    },
    {
        path: "create-owner",
        component: CreatePropertyOwnerComponent
    }
];
