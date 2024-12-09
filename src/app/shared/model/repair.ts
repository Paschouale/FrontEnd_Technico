import { RepairStatus } from "../enumeration/repair-status";
import { RepairType } from "../enumeration/repair-type";
import { Property } from "./property";

export interface Repair{
    id: number,
    repairStatus: RepairStatus,
    repairType: RepairType,
    cost: number,
    property: Property,
    description: Text
}