import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {  Observable } from 'rxjs';
import { Consultas } from 'src/app/interfaces/consultas';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ConsultasService {

  private apiURL = API_URL+"consultas";
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient, private router: Router ) { }

  pacientable(consultas: Consultas): Consultas {
    consultas.pacientable = consultas.pacientable;
    return consultas;
  }

  getConsultas(): Observable<Consultas[]> {
    return this.httpClient.get<Consultas[]>(this.apiURL);
  }

  storeConsulta(consulta: any): Observable<Consultas> {
    return this.httpClient.post<Consultas>(this.apiURL, consulta, this.httpOptions);
  }

  getConsulta(id: number): Observable<Consultas> {
    return this.httpClient.get<Consultas>(`${this.apiURL}/${id}`);
  }

  destroyConsulta(consulta: number): Observable<any> {
    const url = `${API_URL}consultas/${consulta}`;
    return this.httpClient.delete(url);
  }

  getReceta(consultaId: number): Observable<Blob> {
    return this.httpClient.get(API_URL + "recetas/" + consultaId, { responseType: 'blob' });
  }
}