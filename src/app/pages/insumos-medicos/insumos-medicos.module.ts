import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InsumosMedicosRoutingModule } from './insumos-medicos-routing.module';
import { InsumosMedicosIndexComponent } from './index/index.component';

@NgModule({
  declarations: [
    InsumosMedicosIndexComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    InsumosMedicosRoutingModule,
    FormsModule
  ],
})
export class InsumosMedicosModule { }
