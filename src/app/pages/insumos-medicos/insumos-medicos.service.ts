import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {  Observable, switchMap } from 'rxjs';
import { Insumos } from 'src/app/interfaces/insumos';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';
import { Reactivos } from 'src/app/interfaces/reactivos';

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

  getReactivos(): Observable<Reactivos[]> {
    return this.httpClient.get<Reactivos[]>(API_URL+'reactivos');
  }

  getInsumosQueNoTieneInventario(inventarioId: any): Observable<Insumos[]> {
    return this.httpClient.get<Insumos[]>(`${API_URL}insumos/no-inventario/${inventarioId}`);
  }

  storeInsumo(insumo: any, imagen: File | null): Observable<Insumos> {
    if (imagen) {
      return this.procesarImagen(imagen).pipe(
        switchMap(imagenBase64 => {
          insumo.imagen = imagenBase64;
          return this.enviarInsumo(insumo);
        })
      );
    } else {
      return this.enviarInsumo(insumo);
    }
  }

  private procesarImagen(imagen: File): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.readAsDataURL(imagen);
  
      reader.onload = (event) => {
        const imagenBase64 = (event.target as FileReader).result as string;
        observer.next(imagenBase64);
        observer.complete();
      };
    });
  }
  
  private enviarInsumo(insumo: any): Observable<Insumos> {
    return this.httpClient.post<Insumos>(this.apiURL, insumo, this.httpOptions);
  }
  

  addInsumo(insumo: any){
    return this.httpClient.post<Insumos>(`${API_URL}inventarios/add-insumos`, insumo, this.httpOptions);
  }

  getInsumo(id: number): Observable<Insumos> {
    return this.httpClient.get<Insumos>(`${API_URL}insumos-medicos/${id}`);
  }

  getInsumoPorInventario(inventarioId: number, insumoId: number): Observable<Insumos> {
    return this.httpClient.get<Insumos>(`${API_URL}inventarios/${inventarioId}/insumos/${insumoId}`);
  }

  destroyInsumo(insumos: number): Observable<any> {
    const url = `${API_URL}insumos-medicos/${insumos}`;
    return this.httpClient.delete(url);
  }
}