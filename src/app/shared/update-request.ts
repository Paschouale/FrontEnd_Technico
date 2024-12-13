export interface UpdateRequest {
    id: number;
    repairId: number;
    ownerUsername: string;
    message: string;
    timestamp: string; // or Date if you prefer
  }
  