import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  Observable } from 'rxjs';
import { HistorialesMedicos } from './historiales-medicos';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistorialesMedicosService {

  private apiURL = API_URL+"historiales-medicos";
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient, private router: Router ) { }

  pacientable(historialesMedicos: HistorialesMedicos): HistorialesMedicos {
    historialesMedicos.pacientable = historialesMedicos.pacientable;
    return historialesMedicos;
  }

  getHistorialesMedicos (): Observable<HistorialesMedicos[]> {
    return this.httpClient.get<HistorialesMedicos[]>(this.apiURL);
  }

  getHistorialMedico(HistorialMedico: number): Observable<HistorialesMedicos> {
    return this.httpClient.get<HistorialesMedicos>(`${this.apiURL}/${HistorialMedico}`);
  }
}
