import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';
import { Calendario } from 'src/app/interfaces/calendario';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  private apiURL = API_URL;
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient, private router: Router ) { }

  getCalendarioEventos(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiURL+"calendario");
  }

  storeCita(cita: any): Observable<Calendario> {
    return this.httpClient.post<Calendario>(this.apiURL+"citas", JSON.stringify(cita), this.httpOptions);
  }

  destroyCita(id: number): Observable<any> {
    const url = `${this.apiURL}citas/${id}`;
    return this.httpClient.delete(url);
  }

  updateCita(id: number, citaData: any): Observable<any> {
    const url = `${this.apiURL}citas/edit/${id}`;
    return this.httpClient.put(url, citaData);
  }

  getHorariosDisponibles(profesionalId: number, fecha: string): Observable<any> {
    const url = `${this.apiURL}horarios/${profesionalId}/${fecha}/horas-disponibles`;
    return this.httpClient.get(url);
  }
}
