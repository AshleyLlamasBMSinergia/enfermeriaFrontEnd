import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  Observable } from 'rxjs';
import { API_URL } from 'src/app/config';
import { Empleados } from 'src/app/interfaces/empleados';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private apiURL = API_URL+"empleados";
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient) { }

  // Método para obtener los empleados desde la API
  getEmpleados(): Observable<any> {
    return this.httpClient.get<Empleados[]>(this.apiURL);
  }

  getEmpleado(id: number): Observable<Empleados> {
    return this.httpClient.get<Empleados>(`${this.apiURL}/${id}`);
  }

  getEmpleadoSalario(empleadoId: number): Observable<any> {
    return this.httpClient.get<DecimalPipe[]>(API_URL+'salario-de-empleado/'+empleadoId);
  }
}
