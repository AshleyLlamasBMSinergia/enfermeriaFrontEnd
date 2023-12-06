import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import {  Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class EnfermeriaService {
  
  httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
  }
  
  constructor(private httpClient: HttpClient, private router: Router) { }

  getCitasHoy(): Observable<number> {
    return this.httpClient.get<number>(API_URL+'inicio/citas-de-hoy');
  }

  getPendientes(): Observable<any[]> {
      return this.httpClient.get<any[]>(API_URL+"pendientes");
  }

  editEstatusPendiente(id: number, nuevoEstatus: string): Observable<any> {
    const url = `${API_URL}pendientes/update-estatus/${id}`;
    const data = { estatus: nuevoEstatus };
    return this.httpClient.put(url, data);
  }

  storePendiente(pendiente: any): Observable<any> {
    return this.httpClient.post<any>(API_URL+"pendientes", JSON.stringify(pendiente), this.httpOptions);
  }

  updateTituloPendiente(id: number, pendiente: any): Observable<any> {
    const url = `${API_URL}pendientes/update-titulo/${id}`;
    return this.httpClient.put(url, pendiente);
  }

  destroyPendiente(pendiente: number): Observable<any> {
    const url = `${API_URL}pendientes/${pendiente}`;
    return this.httpClient.delete(url);
  }
}
