import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {  Observable } from 'rxjs';
import { Insumos } from 'src/app/interfaces/insumos';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class InsumosMedicosService {

  private apiURL = API_URL+"insumos-medicos";
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient, private router: Router ) { }

  buscador(nombre: string): Observable<any[]> {
    const url = `${API_URL}insumos-medicos/buscador?nombre=${nombre}`;
    return this.httpClient.get<any[]>(url);
  }

  getInsumosMedicos(): Observable<Insumos[]> {
    return this.httpClient.get<Insumos[]>(this.apiURL);
  }

  storeInsumo(insumo: any, imagen: File): Observable<Insumos> {
    return new Observable<Insumos>((observer) => {
      const reader = new FileReader();
      reader.readAsDataURL(imagen);
  
      reader.onload = (event) => {
        const imagenBase64 = (event.target as FileReader).result as string;
        insumo.imagen = imagenBase64;
  
        this.httpClient.post<Insumos>(this.apiURL, insumo, this.httpOptions)
          .subscribe(
            (response) => {
              observer.next(response);
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
      };
    });
  }

  getInsumo(id: number): Observable<Insumos> {
    return this.httpClient.get<Insumos>(`${this.apiURL}/${id}`);
  }

  destroyInsumo(insumos: number): Observable<any> {
    const url = `${API_URL}insumos-medicos/${insumos}`;
    return this.httpClient.delete(url);
  }
}