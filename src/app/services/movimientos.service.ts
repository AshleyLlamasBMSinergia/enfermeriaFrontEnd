import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../config';
import {  Observable } from 'rxjs';
import { Movimientos } from '../interfaces/movimientos';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  constructor( private httpClient: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
 }

  private apiURL = API_URL+"movimientos";

  getMoviemientoTipos(): Observable<any> {
    return this.httpClient.get<Movimientos[]>(API_URL+'tipos-de-movimientos');
  }

  storeMovimiento(movimiento: any): Observable<Movimientos> {
    return this.httpClient.post<Movimientos>(this.apiURL, movimiento, this.httpOptions);
  }
}
