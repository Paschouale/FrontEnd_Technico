import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from '../model/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private http: HttpClient) { }

  getAllProperties(){
    let url = "http://localhost:8080/api/properties";
    return this.http.get<Property[]>(url);
  }

  postProperty(property: Property){
    let url = "http://localhost:8080/api/properties";
    return this.http.post(url, property);
  }
}
