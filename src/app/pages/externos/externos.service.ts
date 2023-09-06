import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  Observable } from 'rxjs';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';
import { Externos } from './externos';

@Injectable({
  providedIn: 'root'
})
export class ExternosService {

  private apiURL = API_URL+"externos";
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient,) { }

  // Método para obtener los externos desde la API
  getExternos(): Observable<any> {
    return this.httpClient.get<Externos[]>(this.apiURL);
  }

  getExterno(id: number): Observable<Externos> {
    return this.httpClient.get<Externos>(`${this.apiURL}/${id}`);
  }
}
