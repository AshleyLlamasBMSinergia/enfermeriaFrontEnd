import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getImagen(url: string): Observable<Blob> {
    return this.http.get(API_URL + "storage/private/" + url, { responseType: 'blob' });
  }
}