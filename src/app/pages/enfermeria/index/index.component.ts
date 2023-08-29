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

  citasHoy: number = 0;
  tasks: any[] = [];

  constructor(private router: Router, private enfermeriaService: EnfermeriaService) {}

  ngOnInit(): void {
    this.enfermeriaService.getCitasHoy().subscribe(
      (citasHoy: number) => {
        this.citasHoy = citasHoy;
      },
      (error) => {
        console.error('Error al obtener el número de citas', error);
      }
    );

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
    this.pendienteModalComponent.openModal();
  }
}
