import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LotesMedicosRoutingModule } from './lotes-medicos-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [

  
    EditComponent,
         CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LotesMedicosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
  ],
})
export class LotesMedicosModule { }
