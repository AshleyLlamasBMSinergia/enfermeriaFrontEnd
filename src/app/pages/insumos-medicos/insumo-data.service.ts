
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsumoDataService {
  private insumoIdSource = new BehaviorSubject<number>(0);
  insumoId$ = this.insumoIdSource.asObservable();

  setInsumoId(id: number) {
    this.insumoIdSource.next(id);
  }
}
