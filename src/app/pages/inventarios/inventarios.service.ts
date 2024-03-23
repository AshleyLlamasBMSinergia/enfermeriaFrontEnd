import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { API_URL } from 'src/app/config';
import { Inventarios } from 'src/app/interfaces/inventarios';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { InventarioDataService } from './inventario-data.service';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  private apiURL = API_URL+"inventarios";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
 }

 constructor( private httpClient: HttpClient, private router: Router, private inventarioDataService: InventarioDataService ) { }

   crearInsumo(inventarioId: number) {
    this.inventarioDataService.setInventarioId(inventarioId);
    this.router.navigate(['/enfermeria/insumos-medicos/create']);
  }

  getInventarios(): Observable<Inventarios[]> {
    return this.httpClient.get<Inventarios[]>(this.apiURL);
  }

  getInventariosDelProfesional(profesionalId: number): Observable<any> {
    const url = `${this.apiURL}/profesional/${profesionalId}`;
    return this.httpClient.get(url);
  }

  inventariosDelProfesionalParaConsulta(profesionalId: number): Observable<any> {
    const url = `${this.apiURL}/consulta/profesional/${profesionalId}`;
    return this.httpClient.get(url);
  }

  getInventario(id: number): Observable<Inventarios> {
    return this.httpClient.get<Inventarios>(`${this.apiURL}/${id}`);
  }

  buscador(nombre: string): Observable<any[]> {
    const url = `${this.apiURL}/buscador?nombre=${nombre}`;
    return this.httpClient.get<any[]>(url);
  }

  //ESTADISTICAS:
  getEstadisticaInsumosConMasLotesCaducos(inventarioId:number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${API_URL}estadisticas/inventario/${inventarioId}/insumos-con-mas-desechos`);
  }

  // getEstadisticaInsumosConMasDespachosPorReceta(inventarioId:number): Observable<any[]> {
  //   return this.httpClient.get<any[]>(`${API_URL}estadisticas/inventario/${inventarioId}/insumos-con-mas-despachos-por-receta`);
  // }

  getEstadisticaInsumosConMasDespachosPorReceta(inventarioId:number, fechaInicial: string, fechaFinal: string): Observable<any[]> {
      return this.httpClient.get<any[]>(`${API_URL}estadisticas/inventario/${inventarioId}/insumos-con-mas-despachos-por-receta?fechaInicial=${fechaInicial}&fechaFinal=${fechaFinal}`);
  }
}
