import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  isLoggedIn = false;

  login(credentials: { email: string; password: string }): Observable<any> {
    const url = `${API_URL}login`;

    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    const requestOptions = {
      headers: new HttpHeaders(headerDict), 
    };

    return this.http.post(url, credentials, requestOptions);
  }

  handleLoginResponse(response: any) {
    if (response.status) {
      this.isLoggedIn = true;
      this.userService.setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      console.log(localStorage);
      this.router.navigate(['/enfermeria/inicio']);
    }
  }

  logout(): void {
    const url = `${API_URL}logout`;
    this.isLoggedIn = false;
    this.userService.clearUser();
    localStorage.removeItem('token');
    this.userService.clearUser();
    this.router.navigateByUrl('/login');
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
    }
  }
}