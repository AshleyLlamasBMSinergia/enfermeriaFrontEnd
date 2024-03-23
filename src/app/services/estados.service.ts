import { Injectable } from '@angular/core';
import { Estados } from '../interfaces/estados';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  private apiURL = API_URL+"estados";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
 }

 constructor( private httpClient: HttpClient) { }

   getEstados(): Observable<any> {
    return this.httpClient.get<Estados[]>(this.apiURL);
  }
}
