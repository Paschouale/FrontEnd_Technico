import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { CreatePropertyOwnerComponent } from './pages/homepage/components/property-owners/create-property-owner/create-property-owner.component';
import { CreatePropertyComponent } from './pages/homepage/components/properties/create-property/create-property.component';

export const routes: Routes = [
    {
        path: "",
        component: HomepageComponent
    },
    {
        path: "create-owner",
        component: CreatePropertyOwnerComponent
    }
    ,
    {
        path: "create-property",
        component: CreatePropertyComponent
    }
];
