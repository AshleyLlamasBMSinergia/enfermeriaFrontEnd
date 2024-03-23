import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';
import { Incapacidades } from 'src/app/interfaces/incapacidades';
import { Router } from '@angular/router';
import { zonasAfectadas } from 'src/app/interfaces/zonas-afectadas';

@Injectable({
  providedIn: 'root'
})
export class IncapacidadesService {

  private apiURL = API_URL+"incapacidades";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
 }

  constructor( private httpClient: HttpClient, private router: Router ) { }

  getIncapacidades(): Observable<Incapacidades[]> {
    return this.httpClient.get<Incapacidades[]>(this.apiURL);
  }

  getIncapacidad(id: number): Observable<Incapacidades> {
    return this.httpClient.get<Incapacidades>(`${this.apiURL}/${id}`);
  }
  
  getZonasAfectadas(): Observable<zonasAfectadas[]> {
    return this.httpClient.get<zonasAfectadas[]>(API_URL+'zonas-afectadas');
  }

  storeIncapacidad(incapacidad: any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL, incapacidad, this.httpOptions);
  }

  storeArchivos(archivos: any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+"/archivos", JSON.stringify(archivos), this.httpOptions);
  }

  getTipoIncidencias(): Observable<any[]> {
    return this.httpClient.get<any[]>(API_URL+'tipos-de-insidencias');
  }

  getControlIncapacidades(): Observable<any[]> {
    return this.httpClient.get<any[]>(API_URL+'control-incapacidades');
  }

  getSecuelas(): Observable<any[]> {
    return this.httpClient.get<any[]>(API_URL+'secuelas');
  }

  getTipoRiesgos(): Observable<any[]> {
    return this.httpClient.get<any[]>(API_URL+'tipos-de-riesgos');
  }

  getTipoPermisos(): Observable<any[]> {
    return this.httpClient.get<any[]>(API_URL+'tipos-de-permisos');
  }

  update(id: number, incapacidad: any): Observable<Incapacidades> {
    const url = `${this.apiURL}/edit/${id}`;
    return this.httpClient.put<Incapacidades>(url, incapacidad, this.httpOptions);
  }
}