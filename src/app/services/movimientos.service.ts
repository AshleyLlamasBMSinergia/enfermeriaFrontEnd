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
    return this.httpClient.get<any[]>(API_URL+'tipos-de-movimientos');
  }

  getMovimientosPorInventario(inventarioId: number): Observable <any> {
    return this.httpClient.get<Movimientos[]>(this.apiURL+'/inventarios/'+inventarioId, this.httpOptions);
  }

  getMovimiento(movimientoId: number): Observable <Movimientos> {
    return this.httpClient.get<Movimientos>(this.apiURL+'/'+movimientoId, this.httpOptions);
  }

  storeMovimientos(movimientos: any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL, movimientos, this.httpOptions);
  }

  buscarPDF(buscarPDF: any) {
    return this.httpClient.post(this.apiURL+'/pdfs', buscarPDF, { responseType: 'blob' });
  }

  storeArchivos(archivos: any): Observable<any> {
    return this.httpClient.post<any>(API_URL+"movimientos/archivos", JSON.stringify(archivos), this.httpOptions);
  }
}
