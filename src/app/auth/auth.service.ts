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
      this.userService.setUser(response.data.user[0]);
      this.router.navigate(['/enfermeria']);
    }
  }

  logout(): Observable<any> {
    const url = `${API_URL}logout`;
    return this.http.post(url, {});
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