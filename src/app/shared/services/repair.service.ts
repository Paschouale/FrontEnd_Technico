import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repair } from '../model/repair';
import { UpdateRequest } from '../update-request';

@Injectable({
  providedIn: 'root'
})
export class RepairService {
  private baseUrl = 'http://localhost:8080/api/repairs';

  constructor(private http: HttpClient) {}

  // Fetch all repairs
  getAllRepairs(): Observable<Repair[]> {
    return this.http.get<Repair[]>(this.baseUrl);
  }

  // Fetch a repair by its ID
  getRepairById(id: number): Observable<Repair> {
    // According to backend: GET /api/repairs/id/{id}
    const url = `${this.baseUrl}/id/${id}`;
    return this.http.get<Repair>(url);
  }

  // Create a new repair
  createRepair(repair: Repair): Observable<Repair> {
    return this.http.post<Repair>(this.baseUrl, repair);
  }

  // Update an existing repair by ID
  updateRepairById(id: number, repair: Repair): Observable<any> {
    // According to backend: PUT /api/repairs/{id}
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, repair);
  }

  // Delete a repair by ID
  deleteRepairById(id: number): Observable<any> {
    // According to backend: DELETE /api/repairs/{id}
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }

  // Fetch repairs by property owner ID if needed
  getRepairsByPropertyOwnerId(ownerId: number): Observable<Repair[]> {
    // According to backend: GET /api/repairs/propertyOwner/{id}
    const url = `${this.baseUrl}/propertyOwner/${ownerId}`;
    return this.http.get<Repair[]>(url);
  }

  // If you want to fetch by date or date range:
  getRepairsByDate(date: string): Observable<Repair[]> {
    const url = `${this.baseUrl}/date/${date}`;
    return this.http.get<Repair[]>(url);
  }

  getRepairsByDateRange(startDate: string, endDate: string): Observable<Repair[]> {
    const url = `${this.baseUrl}/date-range?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<Repair[]>(url);
  }

  sendStatusUpdateRequest(repairId: number, message: string): Observable<any> {
    // Assume POST /api/repairs/{repairId}/request-update with { message } in the body
    return this.http.post(`${this.baseUrl}/${repairId}/request-update`, { message });
  }
  getStatusUpdateRequests(): Observable<UpdateRequest[]> {
    return this.http.get<UpdateRequest[]>(`${this.baseUrl}/update-requests`);
  }
  
}


