import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  Observable } from 'rxjs';
import { HistorialesMedicos } from './historiales-medicos';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';
import { AntecedentesPersonalesPatologicos } from './antecedentes-personales-patologicos';
import { AntecedentesPersonalesNoPatologicos } from './antecedentes-personales-no-patologicos';
import { AntecedentesHeredofamiliares } from './antecedentes-heredofamiliares';

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

  getHistorialMedico(id: number): Observable<HistorialesMedicos> {
    return this.httpClient.get<HistorialesMedicos>(`${API_URL+"historiales-medicos"}/${id}`);
  }

  storeAntecedentespersonalesPatologicos(antecedentesPersonalesPatologicos: any): Observable<AntecedentesPersonalesPatologicos> {
    return this.httpClient.post<AntecedentesPersonalesPatologicos>(API_URL+"antecendentes-personales-patologicos", JSON.stringify(antecedentesPersonalesPatologicos), this.httpOptions);
  }

  updateAntecedentespersonalesPatologicos(
    APPatologicoId: number,
    antecedentesPersonalesPatologicos: any
  ): Observable<AntecedentesPersonalesPatologicos> {
    const url = `${API_URL}antecendentes-personales-patologicos/edit/${APPatologicoId}`;
  
    return this.httpClient.put<AntecedentesPersonalesPatologicos>(
      url,
      JSON.stringify(antecedentesPersonalesPatologicos),
      this.httpOptions
    );
  }

  storeAntecedentespersonalesNoPatologicos(antecedentesPersonalesNoPatologicos: any): Observable<AntecedentesPersonalesNoPatologicos> {
    return this.httpClient.post<AntecedentesPersonalesNoPatologicos>(API_URL+"antecendentes-personales-no-patologicos", JSON.stringify(antecedentesPersonalesNoPatologicos), this.httpOptions);
  }

  updateAntecedentespersonalesNoPatologicos(
    APNPatologicoId: number,
    antecedentesPersonalesNoPatologicos: any
  ): Observable<AntecedentesPersonalesNoPatologicos> {
    const url = `${API_URL}antecendentes-personales-no-patologicos/edit/${APNPatologicoId}`;
  
    return this.httpClient.put<AntecedentesPersonalesNoPatologicos>(
      url,
      JSON.stringify(antecedentesPersonalesNoPatologicos),
      this.httpOptions
    );
  }

  storeAntecedentesHeredofamiliares(antecedentesHeredofamiliares: any): Observable<AntecedentesHeredofamiliares> {
    return this.httpClient.post<AntecedentesHeredofamiliares>(API_URL+"antecendentes-heredofamiliares", JSON.stringify(antecedentesHeredofamiliares), this.httpOptions);
  }

  updateAntecedentesHeredofamiliares(
    APNPatologicoId: number,
    antecedentesHeredofamiliares: any
  ): Observable<AntecedentesHeredofamiliares> {
    const url = `${API_URL}antecendentes-heredofamiliares/edit/${APNPatologicoId}`;
  
    return this.httpClient.put<AntecedentesHeredofamiliares>(
      url,
      JSON.stringify(antecedentesHeredofamiliares),
      this.httpOptions
    );
  }
}
