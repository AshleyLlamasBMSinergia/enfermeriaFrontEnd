import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsumosMedicosRoutingModule } from './insumos-medicos-routing.module';
import { InsumosMedicosIndexComponent } from './index/index.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LotesMedicosIndexComponent } from '../lotes-medicos/index/index.component';
import { InsumosMedicosEditComponent } from './edit/edit.component';
import { InsumosMedicosCreateComponent } from './create/create.component';
@NgModule({
  declarations: [
    InsumosMedicosIndexComponent,
    LotesMedicosIndexComponent,
    InsumosMedicosEditComponent,
    InsumosMedicosCreateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    InsumosMedicosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
  ],
})
export class InsumosMedicosModule { }
