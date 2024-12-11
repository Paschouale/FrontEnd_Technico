import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyOwner } from '../model/property-owner';

@Injectable({
  providedIn: 'root'
})
export class PropertyOwnerService {
  private baseUrl = 'http://localhost:8080/api/propertyOwners';

  constructor(private http: HttpClient) {}

  getPropertyOwnerById(id: number): Observable<PropertyOwner> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<PropertyOwner>(url);
  }

  updatePropertyOwnerById(id: number, owner: PropertyOwner): Observable<any> {
    console.log(owner);
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, owner);
  }

  getAllPropertyOwners(): Observable<PropertyOwner[]> {
    return this.http.get<PropertyOwner[]>(this.baseUrl);
  }

  deletePropertyOwnerById(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }

  createPropertyOwner(propertyOwner: PropertyOwner): Observable<PropertyOwner> {
    const url = 'http://localhost:8080/api/propertyOwners';
    return this.http.post<PropertyOwner>(url, propertyOwner);
  }
  
}
