import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
   }

 constructor( private httpClient: HttpClient) { }

  getSolicitudes(url: string, page: number, pageSize: number, filtros: any[]): Observable<any> {
    let queryParams = `?page=${page}&pageSize=${pageSize}`;
  
    // Agregar filtros a la consulta
    if (filtros) {
      for (const key in filtros) {
        if (filtros.hasOwnProperty(key) && filtros[key]) {
          queryParams += `&${key}=${filtros[key]}`;
        }
      }
    }
  
    return this.httpClient.get<any>(`${API_URL + url}${queryParams}`).pipe(
      map(response => {
        return {
          data: response.data,
          totalPaginas: response.total
        }
      })
    );
  }
  
}
