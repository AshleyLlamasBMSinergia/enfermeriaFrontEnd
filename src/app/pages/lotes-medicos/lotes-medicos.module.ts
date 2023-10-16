import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LotesMedicosRoutingModule } from './lotes-medicos-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { LotesMedicosCreateComponent } from './create/create.component';
import { LotesMedicosShowComponent } from './show/show.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    LotesMedicosCreateComponent,
    LotesMedicosShowComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LotesMedicosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    CKEditorModule
  ],
})
export class LotesMedicosModule { }
