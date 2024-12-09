import { Role } from "../enumeration/role";
import { PropertyOwner } from "./property-owner";

export interface LoginUser{
    id: number,
    username: string,
    password: string,
    role: Role,
    propertyOwner: PropertyOwner
}