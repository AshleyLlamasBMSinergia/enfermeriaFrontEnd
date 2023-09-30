import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {  Observable } from 'rxjs';
import { Lotes } from 'src/app/interfaces/lotes';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';
import { Insumos } from 'src/app/interfaces/insumos';

@Injectable({
  providedIn: 'root'
})

export class LotesMedicosService {

  private apiURL = API_URL+"lotes";
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient, private router: Router ) { }

  buscador(lote: string): Observable<any[]> {
    const url = `${API_URL}lotes/buscador?lote=${lote}`;
    return this.httpClient.get<any[]>(url);
  }

  // getLotes(): Observable<Lotes[]> {
  //   return this.httpClient.get<Lotes[]>(this.apiURL);
  // }

  getInsumo(id: number): Observable<Insumos> {
    return this.httpClient.get<Insumos>(`${API_URL}insumos-medicos/${id}`);
  }

  storeLote(lotes: any): Observable<Lotes> {
    return this.httpClient.post<Lotes>(this.apiURL, lotes, this.httpOptions);
  }

  getLote(id: number): Observable<Lotes> {
    return this.httpClient.get<Lotes>(`${this.apiURL}/${id}`);
  }

  destroyLote(lote: number): Observable<any> {
    const url = `${API_URL}lotes/${lote}`;
    return this.httpClient.delete(url);
  }
}