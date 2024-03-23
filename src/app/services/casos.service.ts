import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Casos } from '../interfaces/casos';

@Injectable({
  providedIn: 'root'
})
export class CasosService {

  private apiURL = API_URL+'casos';
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient) { }

  getCasos(): Observable<any> {
    return this.httpClient.get<Casos[]>(this.apiURL);
  }

  getCaso(id: number): Observable<Casos> {
    return this.httpClient.get<Casos>(`${this.apiURL}/${id}`);
  }

  importarIncidenciasRH(id: number): Observable<any> {
    const url = `${API_URL}incidencias/importar/rh/incidencias/${id}`;
    return this.httpClient.post<any>(url, id, this.httpOptions);
  }

  update(id: number, caso: any): Observable<Casos> {
    const url = `${this.apiURL}/edit/${id}`;
    return this.httpClient.put<Casos>(url, caso, this.httpOptions);
  }
}
