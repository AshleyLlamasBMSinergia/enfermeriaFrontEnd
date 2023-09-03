import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnfermeriaComponent } from './enfermeria.component';
import { EnfermeriaRoutingModule } from './enfermeria-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnfermeriaIndexComponent } from './index/index.component';

@NgModule({
  declarations: [
    EnfermeriaComponent,
    EnfermeriaIndexComponent,
  ],
  imports: [
    CommonModule,
    EnfermeriaRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EnfermeriaModule { }