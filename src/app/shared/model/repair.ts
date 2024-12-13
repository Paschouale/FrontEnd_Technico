import { RepairStatus } from "../enumeration/repair-status";
import { RepairType } from "../enumeration/repair-type";
import { Property } from "./property";

export interface Repair {
    id: number;
    scheduledRepairDate: string; // or Date if you convert it
    repairStatus: RepairStatus;
    repairType: RepairType;
    cost: number;
    property: Property;
    description: string;
  }
  