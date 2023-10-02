import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { Observable } from 'rxjs';
import { Calendario } from 'src/app/interfaces/calendario';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  constructor(private httpClient: HttpClient) {}
    getCita(id: number): Observable<Calendario> {
        return this.httpClient.get<Calendario>(`${API_URL+"citas"}/${id}`);
    }
}