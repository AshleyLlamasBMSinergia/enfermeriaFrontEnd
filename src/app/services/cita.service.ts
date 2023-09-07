import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { Observable } from 'rxjs';
import { Calendario } from '../pages/calendario/calendario';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  constructor(private httpClient: HttpClient) {}

    //Calendario = Citas; Olvide cambiar el nombre desde el inicio
    getCita(id: number): Observable<Calendario> {
        return this.httpClient.get<Calendario>(`${API_URL+"citas"}/${id}`);
    }
}