import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PropertyOwner } from '../model/property-owner';

@Injectable({
  providedIn: 'root'
})
export class PropertyOwnerService {

  constructor(private http: HttpClient) { }

  getAllPropertyOwners(){
    let url = "http://localhost:8080/api/propertyOwners";
    return this.http.get<PropertyOwner[]>(url);
  }

  postPropertyOwner(propertyOwner: PropertyOwner){
    let url = "http://localhost:8080/api/propertyOwners"
    return this.http.post(url, propertyOwner);
  }
}
