import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {  Observable } from 'rxjs';
import { Consultas } from './consultas';
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

}