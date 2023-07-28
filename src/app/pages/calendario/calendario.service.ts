import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  private apiURL = API_URL+"calendario";
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient, private router: Router ) { }

  getCalendarioEventos(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiURL);
  }
}
