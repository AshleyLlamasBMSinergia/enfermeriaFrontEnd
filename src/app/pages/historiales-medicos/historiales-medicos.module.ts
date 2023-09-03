import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialesMedicosIndexComponent } from './index/index.component';
import { HistorialesMedicosCreateComponent } from './create/create.component';
import { HistorialesMedicosEditComponent } from './edit/edit.component';
import { HistorialesMedicosShowComponent } from './show/show.component';
import { RouterModule } from '@angular/router';
import { HistorialesMedicosRoutingModule } from './historiales-medicos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HistorialesMedicosIndexComponent,
    HistorialesMedicosShowComponent,
    HistorialesMedicosCreateComponent,
    HistorialesMedicosEditComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    HistorialesMedicosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class HistorialesMedicosModule { }
