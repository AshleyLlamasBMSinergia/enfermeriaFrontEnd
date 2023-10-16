
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioDataService {
  private inventarioIdSource = new BehaviorSubject<number>(0);
  inventarioId$ = this.inventarioIdSource.asObservable();

  setInventarioId(id: number) {
    this.inventarioIdSource.next(id);
  }
}
