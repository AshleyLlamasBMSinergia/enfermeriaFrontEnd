import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArchivoService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor( private httpClient: HttpClient ) { }

  getArchivo(url: string): Observable<Blob> {
    return this.httpClient.get(API_URL + "storage/private/archivo/" + url, { responseType: 'blob' });
  }

  
  store(archivos: any): Observable<any> {
    return this.httpClient.post<any>(API_URL+"archivos", JSON.stringify(archivos), this.httpOptions);
  }
}