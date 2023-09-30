import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArchivoService {
  constructor(private http: HttpClient) {}

  getArchivo(url: string): Observable<Blob> {
    return this.http.get(API_URL + "storage/private/archivo/" + url, { responseType: 'blob' });
  }
}