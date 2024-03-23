import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Accidentes } from '../interfaces/accidentes';

@Injectable({
  providedIn: 'root'
})
export class AccidentesService {

  private apiURL = API_URL+"accidentes";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
 }

 constructor( private httpClient: HttpClient) { }

  storeAccidentes(accidente: Accidentes): Observable<Accidentes> {
    return this.httpClient.post<Accidentes>(this.apiURL, accidente, this.httpOptions);
  }

  updateAccidentes(id: number, accidente: any): Observable<any> {
    const url = `${this.apiURL}/edit/${id}`;
    return this.httpClient.put(url, accidente);
  }

  destroyAccidente(id: number): Observable<any> {
    const url = `${this.apiURL}/${id}`;
    return this.httpClient.delete(url);
  }
}
