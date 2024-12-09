import { PropertyType } from "../enumeration/property-type";
import { PropertyOwner } from "./property-owner";
import { Repair } from "./repair";

export interface Property{
    id: number,
    numberE9: string,
    address: string,
    yearOfConstruction: number,
    propertyType: PropertyType
    propertyOwner: PropertyOwner,
    repairList: Repair[]
}