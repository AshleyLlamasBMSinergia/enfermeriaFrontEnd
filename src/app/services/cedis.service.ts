import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cedis } from '../interfaces/cedis';

@Injectable({
  providedIn: 'root'
})
export class CedisService {

  private apiURL = API_URL+"cedis";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
 }

 constructor( private httpClient: HttpClient) { }

   getCedis(profesionalId:number): Observable<any> {
    return this.httpClient.get<Cedis[]>(this.apiURL+'/profesional/'+profesionalId);
  }
}
