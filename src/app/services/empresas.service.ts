import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresas } from '../interfaces/empresas';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  private apiURL = API_URL+"empresas";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
 }

 constructor( private httpClient: HttpClient) { }

   getEmpresas(): Observable<any> {
    return this.httpClient.get<Empresas[]>(this.apiURL);
  }
}
