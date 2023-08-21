import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnfermeriaComponent } from './enfermeria.component';
import { EnfermeriaRoutingModule } from './enfermeria-routing.module';
import { FormsModule } from '@angular/forms';
import { EnfermeriaIndexComponent } from './index/index.component';
import { PendienteModalComponent } from './index/pendiente-modal/pendiente-modal.component'; // Importa tu componente aquí

@NgModule({
  declarations: [
    EnfermeriaComponent,
    EnfermeriaIndexComponent,
    PendienteModalComponent,
    PendienteModalComponent
  ],
  imports: [
    CommonModule,
    EnfermeriaRoutingModule,
    FormsModule
  ]
})
export class EnfermeriaModule { }