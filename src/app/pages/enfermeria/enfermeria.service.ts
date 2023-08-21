import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import {  Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class EnfermeriaService {
  
    httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json'
       })
    }
    
    constructor(private httpClient: HttpClient, private router: Router) { }

    getPendientes(): Observable<any[]> {
        return this.httpClient.get<any[]>(API_URL+"pendientes");
    }
}