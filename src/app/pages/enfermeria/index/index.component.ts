import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EnfermeriaService } from '../enfermeria.service';
import { PendienteModalComponent } from './pendiente-modal/pendiente-modal.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class EnfermeriaIndexComponent {

  tasks: any[] = [];

  constructor(private router: Router, private enfermeriaService: EnfermeriaService) {}

  ngOnInit(): void {
    this.enfermeriaService.getPendientes().subscribe(data => {
      this.tasks = data.map(task => ({
        ...task,
        completed: task.estatus === '1' // Convertir 'estatus' en un valor booleano
      }));
    });
  }

  @ViewChild(PendienteModalComponent)
  private pendienteModalComponent!: PendienteModalComponent;

  openEditModal(task: any) {
    console.log('Open Edit Modal called');
    this.pendienteModalComponent.openModal();
  }
}
