import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Repair } from '../model/repair';

@Injectable({
  providedIn: 'root'
})
export class RepairService {

  constructor(private http: HttpClient) { }

  getAllRepairs(){
    let url = "http://localhost:8080/api/repairs";
    return this.http.get<Repair[]>(url);
  }
}
