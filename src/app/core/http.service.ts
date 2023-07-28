import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  static API_END_POINT = environment.API;

  constructor(private http: HttpClient) { }

  get(endpoint: string): Observable<any> {
    return this.http.get(HttpService.API_END_POINT + endpoint);
  }

  put(endpoint: string, body?: object): Observable<any> {
    return this.http.put(HttpService.API_END_POINT + endpoint, body);
  }

  post(endpoint: string, body?: object): Observable<any> {
    return this.http.post(HttpService.API_END_POINT + endpoint, body);
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(HttpService.API_END_POINT + endpoint);
  }
}