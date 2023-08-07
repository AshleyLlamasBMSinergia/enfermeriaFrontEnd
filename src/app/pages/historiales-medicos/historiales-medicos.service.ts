import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  Observable } from 'rxjs';
import { HistorialesMedicos } from './historiales-medicos';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';
import { AntecedentesPersonalesPatologicos } from './antecedentes-personales-patologicos';

@Injectable({
  providedIn: 'root'
})
export class HistorialesMedicosService {
  
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
    return this.httpClient.get<HistorialesMedicos[]>(API_URL+"historiales-medicos");
  }

  getHistorialMedico(HistorialMedico: number): Observable<HistorialesMedicos> {
    return this.httpClient.get<HistorialesMedicos>(`${API_URL+"historiales-medicos"}/${HistorialMedico}`);
  }

  storeAntecedentespersonalesPatologicos(antecedentesPersonalesPatologicos: any): Observable<AntecedentesPersonalesPatologicos> {
    return this.httpClient.post<AntecedentesPersonalesPatologicos>(API_URL+"antecendentes-personales-patologicos", JSON.stringify(antecedentesPersonalesPatologicos), this.httpOptions);
  }
}
