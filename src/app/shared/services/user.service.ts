// src/app/shared/services/user.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'PROPERTY_OWNER';
  propertyOwnerId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  constructor() {
    const userJson = localStorage.getItem('user');
    const user: User | null = userJson ? JSON.parse(userJson) : null;
    this.userSubject = new BehaviorSubject<User | null>(user);
    this.user$ = this.userSubject.asObservable();
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  clearUser() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}
