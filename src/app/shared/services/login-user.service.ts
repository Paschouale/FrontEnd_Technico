import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
  private baseUrl = 'http://localhost:8080/api/login'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  changePassword(username: string, oldPassword: string, newPassword: string): Observable<string> {
    const body = { username, oldPassword, newPassword };
    return this.http.put<string>(`${this.baseUrl}/change-password`, body);
  }
}
