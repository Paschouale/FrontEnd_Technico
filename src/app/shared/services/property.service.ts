import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../model/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private baseUrl = 'http://localhost:8080/api/properties';

  constructor(private http: HttpClient) {}

  // Fetch all properties
  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.baseUrl);
  }

  // Fetch a single property by its ID number
  getPropertyById(id: number): Observable<Property> {
    // According to your backend: GET /api/properties/id/{propertyIdNumber}
    const url = `${this.baseUrl}/id/${id}`;
    return this.http.get<Property>(url);
  }

  // Create a new property
  createProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, property);
  }

  // Update an existing property by ID
  updatePropertyById(id: number, property: Property): Observable<any> {
    // According to your backend: PUT /api/properties/{propertyIdNumber}
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, property);
  }

  deletePropertyByPropertyIdNumber(id: number): Observable<any> {
    const url = `http://localhost:8080/api/properties/${id}`;
    return this.http.delete(url);
  }

  postProperty(property: Property){
    let url = "http://localhost:8080/api/properties";
    return this.http.post(url, property);
  }}
//   postProperty(property: Property): Observable<Property> {
//     return this.http.post<Property>(`${this.baseUrl}`, property);
//   }

// }
