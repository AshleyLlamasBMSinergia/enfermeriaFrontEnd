import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.removeItem('user');
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject;
  }

  clearUser() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}