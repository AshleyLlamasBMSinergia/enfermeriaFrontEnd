import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CapitalizarTextoService {

  constructor() { }

  capitalizarTexto(texto: string): string {
    if(texto){
      return texto.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    }else{
      return texto;
    }
  }
}
