import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private solicitudesSubject = new BehaviorSubject<any[]>([]);
  solicitudes$ = this.solicitudesSubject.asObservable();

  private filtrosSubject = new BehaviorSubject<any[]>([]);
  filtros$ = this.filtrosSubject.asObservable();

  updateSolicitudes(solicitudes: any[]) {
    this.solicitudesSubject.next(solicitudes);
  }

  updateFiltros(filtros: any[]) {
    this.filtrosSubject.next(filtros);
  }
}
