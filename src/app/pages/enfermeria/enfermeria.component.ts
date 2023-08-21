import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enfermeria',
  templateUrl: './enfermeria.component.html',
  styleUrls: ['./enfermeria.component.css']
})
export class EnfermeriaComponent {
  constructor(private router: Router) {}
}
